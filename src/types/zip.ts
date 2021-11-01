import { ZipObj } from "ts-toolbelt/out/List/_api";

type ZipResult = ZipObj<['a', 'b'], [1, true]>;

const func = <A extends Array<string>>(...fields: A) => <B extends Array<any>>(...keys: B): ZipObj<A,B> => {
    return {} as ZipObj<A,B>
}


const asTupleOfLiterals= <T extends string, U extends [T, ...T[]]>(tuple: U):  U => tuple;

const res1 = func('a', 'b', 'c')(1, 'ss', true);