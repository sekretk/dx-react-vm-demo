import { option } from "fp-ts"
import { none, None, Option, Some } from "fp-ts/lib/Option"
import { sequenceT } from "fp-ts/lib/Apply"
import { some } from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/function"
import { never } from "fp-ts/lib/Task"
import { GrandOptionCompact } from "../types/option.utils"


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