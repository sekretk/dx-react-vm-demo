import { IfStrictEquals, IsTrue, IsFalse } from "./test-utils";

type Mixed = {
    a: string;
    b: string;
    c: number;
    d: boolean;
    e: 'im_literal';
};

//Variant01! wild one but in one type!
type If<T extends boolean, R, E = never> = T extends true ? R : E;
type Exact<T, U> = T extends U ? U extends T ? true : false : false;
type ByTypeSelector<Type, F> = {
    [Property in keyof Type as If<Exact<Type[Property], F>, Property>]: Type[Property]
};

//Variant02! Naive
//   type ByTypeSelector<T, F> = {
//     [K in FilteredKeys<T,F>]: T[K]
//   }

//Variant03! elegant one
// type FilteredKeys<T, TargetType> = {
//     [K in keyof T]: T[K] extends TargetType ? TargetType extends T[K] ? K : never : never
// }[keyof T];
//type ByTypeSelector<T, F> = Pick<T, FilteredKeys<T, F>>;

type OnlyStrings<T> = ByTypeSelector<T, string>;

const result: OnlyStrings<Mixed> = { a: 'a', b: 'some' };

type TESTCASE = [
    IsTrue<IfStrictEquals<OnlyStrings<Mixed>, { a: string, b: string }>>,
    IsFalse<IfStrictEquals<OnlyStrings<Mixed>, { a: string, b: string, e: 'im_literal' }>>
]

  //T -> {K in keyof T extends string}

  //Mixed => {a: string, b: string}