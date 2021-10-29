import { None, Option, Some } from "fp-ts/lib/Option"
import { IfStrictEquals, IsTrue } from "./test-utils";
import { TypeError } from './generic'

type UnWrapperOption<T> = T extends Some<infer A> ? UnWrapperOption<A> : T extends None ? never : T;

const GRAND_OPTION_COMPACT_ERROR = 'GrandOptionCompact can unwrap only HKT Options';

export type GrandOptionCompact<T> = IfStrictEquals<T, UnWrapperOption<T>, TypeError<typeof GRAND_OPTION_COMPACT_ERROR>, Option<UnWrapperOption<T>>>;

export type TYPES_TEST_SUITE_01 = [
    IsTrue<IfStrictEquals<GrandOptionCompact<Option<string>>, Option<string>>>,
    IsTrue<IfStrictEquals<GrandOptionCompact<Option<Option<string>>>, Option<string>>>,
    IsTrue<IfStrictEquals<GrandOptionCompact<Option<Option<{a: string}>>>, Option<{a: string}>>>,
    IsTrue<IfStrictEquals<GrandOptionCompact<'some string'>, TypeError<typeof GRAND_OPTION_COMPACT_ERROR>>>,
]