import { pending, RemoteData, success } from '@devexperts/remote-data-ts';
import { createElement, memo, useEffect, useMemo, useState } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { LiveData } from '@devexperts/rx-utils/dist/live-data.utils';
import { newSink, Sink, sink } from '@devexperts/rx-utils/dist/sink2.utils';
import { Context, context } from '@devexperts/rx-utils/dist/context2.utils';
import { observable } from '@devexperts/rx-utils/dist/observable.utils';
import { delay, distinctUntilChanged, share, switchMap } from 'rxjs/operators';
import { render } from 'react-dom';
import { merge, Observable, of } from 'rxjs';
import { Profile, renderRemoteData } from './profile';

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
interface UserProfileViewModel {
	readonly name: LiveData<Error, string>;
	readonly updateName: (name: string) => void;
}

type UserID = string;

const userIdNameMapper: Record<UserID, string> = {
	'1': 'Homer J. Simpson',
	'2': 'Barney Humble',
	'3': 'Moe Sizlak'
};

const getMockDelay = () => 1_000 * (1 + Math.floor(Math.random()*1_000_000) % 5);

interface UserService {
	readonly getAllUserIds: () => LiveData<Error, string[]>;
	readonly getUserName: (id: UserID) => LiveData<Error, string>;
	readonly updateUserName: (id: UserID) => (name: string) => LiveData<Error, void>;
}

const userService: Context<{ apiURL: string }, UserService> = () =>
	sink.of({
		getAllUserIds: () => merge(
			of(pending),
			of(success(['1', '2', '3'])).pipe(delay(1500)),
		),
		getUserName: (id) => merge(
			of(pending),
			of(success(userIdNameMapper[id])).pipe(delay(getMockDelay()))
		),
		updateUserName: (id) => (name) => {
			console.log('update user name', id, name);
			userIdNameMapper[id] = name;
			return of(success<Error, void>(undefined));
		}
	});

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
			switchMap(userService.updateUserName(id)),
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
const UserProfileContainer = context.combine(
	newUserProfileViewModel,
	ctx =>
		memo((props: UserProfileContainerProps) => {
			const vm = useSink(() => ctx(props.id), [props.id]);
			const name = useObservable(vm.name, pending);
			return createElement(Profile, { name, onNameUpdate: vm.updateName });
		}),
);

interface AppProps {
	readonly userIds: RemoteData<Error, string[]>;
}

const App = context.combine(
	UserProfileContainer,
	UserProfileContainer =>
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

const AppContainer = context.combine(
	App,
	newAppViewModel,
	(App, newAppViewModel) =>
		memo(() => {
			console.log('AppContainer create');
			const vm = useMemo(() => newAppViewModel(), []);
			const userIds = useObservable(vm.userIds, pending);
			return createElement(App, { userIds });
		}),
);

const Root = context.combine(
	context.defer(AppContainer, 'userService'),
	userService, //Context<{apiURL: string}, UserService> = {apiURL: string} => Sink<UserService>
	(getAppContainer, userService) =>
		memo(() => {
			console.log('Root create');
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