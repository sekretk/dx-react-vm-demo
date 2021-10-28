import { array, option } from "fp-ts"
import { constant, pipe } from "fp-ts/lib/function"
import { none, Option, some } from 'fp-ts/lib/Option';
import { Predicate } from "fp-ts/lib/Predicate";

type TIssue = {
    a: string,
    b: number
}

const pred: Predicate<TIssue> = (val) => val.b === 5;

const getFilteredHeader = (data: Option<{f: Option<TIssue>, s: Option<TIssue>}>): Option<TIssue> => 
    pipe(
        data,
        option.map(xxx => [xxx.f, xxx.s]),
        option.map(array.filter(option.fold(constant(false), pred))),
        option.chain(array.head),
        option.flatten
    )


expect(
    getFilteredHeader(some({f: some({a: '1', b: 2 }), s: some({a: '1', b: 3})}))
).toEqual(
    none
);

expect(
    getFilteredHeader(some({f: some({a: '1', b: 2 }), s: some({a: '1', b: 5})}))
).toEqual(
    some({a: '1', b: 5})
);