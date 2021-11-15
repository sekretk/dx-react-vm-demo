import { IfStrictEquals, IsFalse, IsTrue } from "./test-utils";

export type TypeCheckError<T extends string> = {
    Error: T
}

export type KeyValueTuple<T, Y extends string> = [Y, T];

export type IsStringLiteral<T> = IfStrictEquals<T, string, false, true>;

type TEST_CASE_IS_STRING_LITERAL = [
    IsTrue<IsStringLiteral<'sss'>>,
    IsFalse<IsStringLiteral<string>>,
    IsTrue<IsStringLiteral<''>>,
]