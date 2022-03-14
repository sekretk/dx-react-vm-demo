import { boolean } from "fp-ts";
import { FunctionN, pipe } from "fp-ts/lib/function";
import { Refinement } from "fp-ts/lib/Refinement";
import { never } from "fp-ts/lib/Task";

type ZipWithName<T extends Array<any>, U extends Array<string>> =
    T extends [head: infer THead, ...rest: infer TTail]
    ? U extends [head: infer UHead, ...rest: infer UTail]
    ? UHead extends string
    ? UTail extends Array<any>
    ? Record<UHead, THead> & ZipWithName<TTail, UTail>
    : never
    : never
    : never
    // eslint-disable-next-line @typescript-eslint/ban-types
    : {};



const mergeTuple = <U extends Array<string>>(...names: U) => <T extends Array<any>>(...tuple: T): ZipWithName<T, U> =>
    names.reduce((acc, cur, idx) => ({ ...acc, [cur]: tuple[idx] }), {}) as ZipWithName<T, U>;

//returns: {some: number, val: string}
const mergeObject01 = mergeTuple('some', 'val', "foo")(1, 'ss', true);

//----------------------------------
// tuple of strings to tuple of literals

const asTupleOfLiterals = <T extends string, U extends [T, ...T[]]>(tuple: U): U => tuple;

const vall = asTupleOfLiterals(['some', 'val']);
type TR01 = typeof vall;

const arr = ['some', 'val'];
type TR02 = typeof arr;

//-----------------------------------
//union of elements of tuple

type TupleUnion<T extends Array<any>> = T extends [head: infer THead, ...rest: infer TTail]
    ? TTail extends Array<any>
    ? Omit<THead, keyof TupleUnion<TTail>> extends THead
    ? THead & TupleUnion<TTail>
    : 'COLLISION ERROR'
    : THead
    // eslint-disable-next-line @typescript-eslint/ban-types
    : {};

const union = <T extends Array<any>>(...items: T): TupleUnion<T> => items.reduce((acc, cur) => ({ ...acc, ...cur }), {})

const tt = union({ a: 1 }, { b: 'asdas', a: boolean });

const aa = { a: 1 }
const bb = { a: 1, b: true }

type tt = Omit<typeof bb, keyof typeof aa>;




//Create tuple number limitation
type OnlyTuple<T extends any[], R extends number> = T['length'] extends R ? T : never;

type OnlyTwoOTuple<T extends any[]> = OnlyTuple<T, 2>;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const onlyTwoElemns = <T extends any[]>(...val: OnlyTwoOTuple<T>): void => { };
onlyTwoElemns(1, 2)

type DecreaseNum = {
    1: 0
    2: 1,
    3: 2,
    4: 3
}

type Nums = {
    1: 0
    2: 0 | 1,
    3: 0 | 1 | 2,
    4: 0 | 1 | 2 | 3
}

type ReplaceInTuple<T extends any[], N extends keyof DecreaseNum | 0, Replace, Tail extends any[] = []> =
    T extends [infer Current, ...infer Rest]
        ? N extends 0
            ? [...Tail, Replace, ...Rest]
            : N extends keyof DecreaseNum 
                ? ReplaceInTuple<Rest, DecreaseNum[N], Replace, [...Tail, Current]>
                : never
        : Tail

type ttt = ReplaceInTuple<[number, string, boolean], 3, undefined>;

const tupleGuard = <T extends any[] & {'length': keyof DecreaseNum}, N extends Nums[T['length']] | 0, R extends T[N]>(num: N, guard: Refinement<T[N], R>) =>
    (tuple: T | ReplaceInTuple<T, N, R>): tuple is ReplaceInTuple<T, N, R> => guard(tuple[num]);
    
const tupleMap = <T extends any[] & {'length': keyof DecreaseNum}, N extends Nums[T['length']] | 0, R>(num: N, project: FunctionN<[T[N]], R>) =>
    (tuple: T): ReplaceInTuple<T, N, R> => tuple.map((val, idx) => idx === num ? project(val) : val) as ReplaceInTuple<T, N, R>;

type Tuple<T extends any[] & {'length': keyof DecreaseNum}, N extends Array<Nums[T['length']] | 0>> = 
    N 

//TODO
/*
const issuedTuple: [number, string, boolean, string ] = [1, '1', true, ''];
expect(pipe(issuedTuple,
   tupleMultyMap([1,2], (num, str) => num.toString() + str)
)).toBe(['11', true, ''])

expect(pipe(issuedTuple,
   tupleMultyMap([1,3], (num, bl) => num.toString() + bl.toString())
)).toBe(['1true', '1', ''])

expect(pipe(issuedTuple,
   tupleMultyMap([3,1], (num, bl) => num.toString() + bl.toString())
)).toBe(['1true', '1', ''])

expect(pipe(issuedTuple,
   tupleMultyMap([3,1,3,1], (num, bl) => num.toString() + bl.toString())
)).toBe(['1true', '1', ''])

expect(pipe(issuedTuple,
   tupleMultyMap([3], (bl) => bl.toString())
)).toBe([1, '1', 'true', ''])

*/
// const tupleMultyMap = <T extends any[] & {'length': keyof DecreaseNum}, N extends Array<Nums[T['length']] | 0>, R>(nums: N, project: FunctionN<[T[N]], R>) =>
//     (tuple: T): ReplaceInTuple<T, N, R> => tuple.map((val, idx) => idx === num ? project(val) : val) as ReplaceInTuple<T, N, R>;

const issuedTuple: [number, string, boolean, string ] = [1, '1', true, ''];

const isOne = (val: string): val is '1' => val === '1';
const isOneN = (val: number): val is 1 => val === 1;

const res = pipe(
    issuedTuple,
    tupleGuard(4, isOneN),
    _ => _
)