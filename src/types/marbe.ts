import { T } from "ramda";
import { renderRemoteData } from "../profile";
import { IfStrictEquals, IsFalse, IsTrue } from "./test-utils";

type ALPHABET = 'A' | 'B' | 'C';

type MARBLE_HELPERS = '-' | '#' | '^';

type ResolveMarble<T extends string, R = unknown> = T extends `${infer A}${infer Rest}` ? Record<A, any> & ResolveMarble<Rest, Omit<R, A>> : unknown;

type InternalMarbleTemplate<T, K extends keyof T> = K extends string ? `${K}${SEPARATOR}${keyof T[K] & string}` | `${K}.${InnerPath<T[K], keyof T[K]>}` : never;

type MarbleTemplate<T> = keyof T | InternalMarbleTemplate<T, keyof T>;



export type TYPES_TEST_SUITE_UnWrapOption = [
    IsFalse<IfStrictEquals<ResolveMarble<'AB'>, Record<'A' | 'B' | 'C', any>>>
    IsTrue<IfStrictEquals<ResolveMarble<'AB'>, Record<'A' | 'B', any>>>,
]

type Decr = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // add to a reasonable amount

type Recurse<N extends number> = N extends 0 ? 
  { foo: string } : 
  { foo: string; sub: Recurse<Decr[N]> }

type MarbleItem = ALPHABET | MARBLE_HELPERS;

type T_MARBLE_RECURSIVE_DEPTH = 2;

type Marble<N extends Decr[number] = T_MARBLE_RECURSIVE_DEPTH> = N extends 0 ? MarbleItem : `${ALPHABET}${Marble<Decr[N]>}`;

type TerminatedMarble = Marble | `${Marble}|`;

type MarbleObj<T extends string> = 
    T extends `${infer K}${infer Rest}` 
        ? K extends MarbleItem 
            ? K extends ALPHABET 
                ? Record<K, any> & MarbleObj<Rest> 
                : MarbleObj<Rest> 
            : `Element ${K} is not accepted as marble item`
        : unknown;

type rr = {a: string} & unknown;

const ttt: MarbleObj<'ABC#$%@'>;

type MarbleT = 'A' | 'B';
type MarbleA = '-' | '^' | '|';

type MarbleDetails<T extends string, R = {}> = 
    T extends `${infer M}${infer Rest}` 
        ? M extends MarbleA 
            ? MarbleDetails<Rest, R>
            : M extends MarbleT
                ? Record<M, any> & MarbleDetails<Rest, R>
                : 'Unknow letter'
        : {};

const funct = <T extends string>(val: T, obj: MarbleDetails<T>) => {}

funct('AB---|', {B: 1, A: 'asd'})