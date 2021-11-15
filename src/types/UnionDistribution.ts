import { T } from "ts-toolbelt";
import { IfStrictEquals, IsTrue } from "./test-utils";

type LookIntoArray<T> = T extends Array<infer F> ? F : never;

type UnionArrayType<T> = T extends any ? LookIntoArray<T> : never;

type UnionToArray<T> = T extends any ? Array<T> : never;

type TEST_CASE_UNION_ARRAY_TYPE = [
    IsTrue<IfStrictEquals<UnionArrayType<Array<string> | Array<number>>, string | number>>,
    IsTrue<IfStrictEquals<UnionArrayType<Array<string> | Array<number | string>>, string | number>>,
];

type TEST_CASE_UNION_TO_ARRAY = [
    IsTrue<IfStrictEquals<UnionToArray<string | number>, Array<string> | Array<number>>>,
];