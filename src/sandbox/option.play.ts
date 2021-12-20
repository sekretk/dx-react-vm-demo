import { option } from "fp-ts"
import { none, None, Option, Some } from "fp-ts/lib/Option"
import { sequenceT } from "fp-ts/lib/Apply"
import { some } from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/function"
import { never } from "fp-ts/lib/Task"
import { GrandOptionCompact, OptionMergeResult } from "../types/option.utils"
import { KeyValueTuple } from "../types/generic"

//expected sugnature: [Option<number>, Option<boolean>] -> Option<[number, boolean]>
//to avoid using deprecated method
const result = sequenceT(option.Apply)(some(1), some(true))


//to use in pipe:
//(Option<R>) -> (Option<T>) -> Option<[R,T]>

const optionCombine = <A, B>(aux: Option<B>) => (src: Option<A>): Option<[A, B]> => 
    sequenceT(option.Apply)(src, aux);

const res01 = pipe(
    some(true),
    optionCombine(some(1)),

)


export const grandOptionCompact = <T>(opt: T): GrandOptionCompact<T> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore 
    if (opt._tag === 'None') return none;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore 
    if (opt._tag === 'Some') return grandOptionCompact(opt.value);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore 
    return opt;
}


//type optionMergeResultEx = OptionMergeResult<[['a', Option<number>], ['b', Option<string>]]>

const optionMerge = <T extends Array<KeyValueTuple<Option<unknown>, R>>, R extends string>(...args: T): Option<OptionMergeResult<T>> => 
    args.reduce((acc, [name, value]) => {
        return pipe(
            sequenceT(option.Apply)(acc, value),
            option.map(([a, b]) => ({...a, ...{[name]: b}}))
        )
    }
    , some({})) as Option<OptionMergeResult<T>>;

const optiRes = optionMerge(['val', some(1)], ['foo', some(true)], ['bar', some('val')]);

const rerr = pipe(
    some(1),
    option.map(_ => _ + 1),
    option.chain(_ => some(_))
)