import { None, Option, Some } from "fp-ts/lib/Option"
import { IfStrictEquals, IsTrue } from "./test-utils";
import { TypeError } from './generic'
import { sequenceT } from "fp-ts/lib/Apply";
import { option } from "fp-ts";
import { pipe } from "fp-ts/lib/function";

//type UnboxedOption<U> = (U extends Option<infer A> ? (k: A) => void : never) extends (k: infer I) => void ? I : never;
type UnWrapperOption<T> = T extends Some<infer A> ? UnWrapperOption<A> : T extends None ? never : T;

const GRAND_OPTION_COMPACT_ERROR = 'GrandOptionCompact can unwrap only HKT Options';

export type GrandOptionCompact<T> = IfStrictEquals<T, UnWrapperOption<T>, TypeError<typeof GRAND_OPTION_COMPACT_ERROR>, Option<UnWrapperOption<T>>>;

export type TYPES_TEST_SUITE_01 = [
    IsTrue<IfStrictEquals<GrandOptionCompact<Option<string>>, Option<string>>>,
    IsTrue<IfStrictEquals<GrandOptionCompact<Option<Option<string>>>, Option<string>>>,
    IsTrue<IfStrictEquals<GrandOptionCompact<Option<Option<{a: string}>>>, Option<{a: string}>>>,
    IsTrue<IfStrictEquals<GrandOptionCompact<'some string'>, TypeError<typeof GRAND_OPTION_COMPACT_ERROR>>>,
]

const tupleArgs = <A extends unknown[], R>(f: (...args: A) => R): ((args: A) => R) => args => f(...args);

// (Option<A>, Option<B>, (A, B) => R) => Option<R>
// better solution in vacant here 
const combine = <A, B, R>(oa: Option<A>, ob: Option<B>, combFunc: (_: A, __: B) => R): Option<R> => {
    return pipe(
        sequenceT(option.Apply)(oa, ob),
        option.map(tupleArgs(combFunc))
    )
}