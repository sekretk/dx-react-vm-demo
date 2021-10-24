import { fold, pending, RemoteData } from '@devexperts/remote-data-ts';
import { constNull } from 'fp-ts/lib/function';
import { createElement, memo, useEffect, useMemo, useState } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { LiveData } from '@devexperts/rx-utils/dist/live-data.utils';
import { newSink, Sink } from '@devexperts/rx-utils/dist/sink2.utils';
import { Context, context } from '@devexperts/rx-utils/dist/context2.utils';
import { observable } from '@devexperts/rx-utils/dist/observable.utils';
import { distinctUntilChanged, share, switchMap } from 'rxjs/operators';
import { render } from 'react-dom';
import { Observable } from 'rxjs';

const useObservable = <A>(fa: Observable<A>, initial: A): A => {
	const [a, setA] = useState(initial);
	const subscription = useMemo(() => fa.subscribe(setA), [fa]); // create subscription immediately
	useEffect(() => () => subscription.unsubscribe(), [subscription]);
	return a;
};
const useSink = <A>(factory: () => Sink<A>, dependencies: unknown[]): A => {
	const sa = useMemo(factory, dependencies);
	const subscription = useMemo(() => sa.effects.subscribe(), [sa]); // create subscription immediately
	useEffect(() => () => subscription.unsubscribe(), [subscription]);
	return sa.value;
};

const renderRemoteData = <A>(
	onSuccess: (a: A) => JSX.Element | null,
): ((data: RemoteData<Error, A>) => JSX.Element | null) =>
	fold(
		constNull,
		() => createElement('div', null, 'pending'),
		() => createElement('div', null, 'failure'),
		onSuccess,
	);

interface UserProfileProps {
	readonly name: RemoteData<Error, string>;
	readonly onNameUpdate: (name: string) => void;
}
const UserProfile = memo((props: UserProfileProps) =>
	pipe(
		props.name,
		renderRemoteData(name => createElement('div', null, name)),
	),
);
interface UserProfileViewModel {
	readonly name: LiveData<Error, string>;
	readonly updateName: (name: string) => void;
}
interface UserService {
	readonly getAllUserIds: () => LiveData<Error, string[]>;
	readonly getUserName: (id: string) => LiveData<Error, string>;
	readonly updateUserName: (id: string, name: string) => LiveData<Error, void>;
}
interface NewUserProfileViewModel {
	(id: string): Sink<UserProfileViewModel>;
}
const newUserProfileViewModel = context.combine(
	context.key<UserService>()('userService'),
	(userService): NewUserProfileViewModel => id => {
		const [updateName, updateNameEvent] = observable.createAdapter<string>();
		const updateNameEffect = pipe(
			updateNameEvent,
			distinctUntilChanged(),
			switchMap(name => userService.updateUserName(id, name)),
			share(),
		);
		return newSink(
			{
				name: userService.getUserName(id),
				updateName,
			},
			updateNameEffect,
		);
	},
);

interface UserProfileContainerProps {
	readonly id: string;
}
const UserProfileContainer = context.combine(newUserProfileViewModel, newUserProfileViewModel =>
	memo((props: UserProfileContainerProps) => {
		const vm = useSink(() => newUserProfileViewModel(props.id), [props.id]);
		const name = useObservable(vm.name, pending);
		return createElement(UserProfile, { name, onNameUpdate: vm.updateName });
	}),
);

interface AppProps {
	readonly userIds: RemoteData<Error, string[]>;
}
const App = context.combine(UserProfileContainer, UserProfileContainer =>
	memo((props: AppProps) =>
		pipe(
			props.userIds,
			renderRemoteData(ids =>
				createElement(
					'div',
					null,
					ids.map(id => createElement(UserProfileContainer, { key: id, id })),
				),
			),
		),
	),
);

interface AppViewModel {
	readonly userIds: LiveData<Error, string[]>;
}
interface NewAppViewModel {
	(): AppViewModel;
}
const newAppViewModel = context.combine(
	context.key<UserService>()('userService'),
	(userService): NewAppViewModel => () => ({
		userIds: userService.getAllUserIds(),
	}),
);

const AppContainer = context.combine(App, newAppViewModel, (App, newAppViewModel) =>
	memo(() => {
		const vm = useMemo(() => newAppViewModel(), []);
		const userIds = useObservable(vm.userIds, pending);
		return createElement(App, { userIds });
	}),
);

declare const userService: Context<{ apiURL: string }, UserService>;

const Root = context.combine(context.defer(AppContainer, 'userService'), userService, (getAppContainer, userService) =>
	memo(() => {
		const AppContainer = useSink(() => getAppContainer({ userService }), []);
		return createElement(AppContainer, {});
	}),
);

const apiURL = '/api';
const Index = memo(() => {
	const Resolved = useSink(() => Root({ apiURL }), []);
	return createElement(Resolved, {});
});
render(createElement(Index), document.getElementById('root'));