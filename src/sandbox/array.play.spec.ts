import { array, option } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import * as FPTSNumber from "fp-ts/lib/number";
import { getLastMonoid, isNone, none, Option, some } from "fp-ts/lib/Option";
import { getFilteredHeader } from "./array.play";

describe('array.play module test suite', () => {
    it('should pass', () => {
        expect(
            getFilteredHeader((val) => val.b === 5)(some({ f: some({ a: '1', b: 2 }), s: some({ a: '1', b: 3 }) }))
        ).toEqual(
            none
        );
    });

    it('should filter to none', () => {
        expect(
            getFilteredHeader((val) => val.b === 5)(some({ f: some({ a: '1', b: 2 }), s: some({ a: '1', b: 5 }) }))
        ).toEqual(
            some({ a: '1', b: 5 })
        );
    })

    // const arraySeq = (arr: [number, number]): Option<[number, number]> => {
    //     arr.reduce((acc, cur) => {
    //         isNone(cur) ? acc : pipe(

    //         )
    //     }, some([]))
    // }

    it('sequence of nones', () => {
        const result = pipe(
            [some(5), none, some(5)],
            array.compact,
            array.head
        );

        expect(result).toStrictEqual(some(5))
    })

    it('array reduce', () => {
        const numSumOptionMonoid = option.getMonoid(FPTSNumber.MonoidSum);

        const list = [some(1), some(2), some(3)];

        const compute = (list: Option<number>[]): Option<number> =>
            pipe(list, array.reduce(none, numSumOptionMonoid.concat));

        expect(compute(list)).toStrictEqual(some(6)); // some(3)
    })
})





