import { array, option } from "fp-ts"
import { sequenceT } from "fp-ts/lib/Apply";
import { constant, pipe } from "fp-ts/lib/function"
import { getLastMonoid, Option, sequenceArray, some } from 'fp-ts/lib/Option';
import { Predicate } from "fp-ts/lib/Predicate";

type TIssue = {
    a: string,
    b: number
}

//const pred: Predicate<TIssue> = (val) => val.b === 5;

export const getFilteredHeader = (pred: Predicate<TIssue>) => (data: Option<{f: Option<TIssue>, s: Option<TIssue>}>): Option<TIssue> => 
    pipe(
        data,
        option.map(xxx => [xxx.f, xxx.s]),//filtermap ?
        option.map(array.filter(option.fold(constant(false), pred))),
        option.chain(array.head),
        option.flatten
    )

const optionCombine = <A, B>(aux: Option<B>) => (src: Option<A>): Option<[A, B]> => sequenceT(option.Apply)(src, aux);


const arr = [some({a: 1}), some({b: true})]
//sequenceArray(arr);

type Head<T extends ReadonlyArray<any>> = T extends [] ? never : T[0];
//type Tail<T extends ReadonlyArray<any>> = T extends [head: any, ...tail: infer Tail] ? Tail : never;
type Tail<T extends ReadonlyArray<any>> = T extends [head: any, ...tail: infer Tail_]
  ? Tail_
  : never;

const issueArray = [1,'2', true] as const;
type test = Tail<typeof issueArray>

// type UnionType<T extends Array<any>> = 
//         T extends [infer F, ...Array<any>]

//type AggregateFunction<A extends Array<any>> = (arg: A) => UnionType<A>;

//const aggregate: AggregateFunction = ({a = 1}, {b = true}) => 


