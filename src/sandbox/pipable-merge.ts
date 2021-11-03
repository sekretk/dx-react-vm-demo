import { Option, some } from 'fp-ts/Option';
import { array, option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';
import { A } from 'ts-toolbelt';

type MergeItem<T, Y extends string> = [Y, T];

type MergeResult<T> = 
    T extends [x: infer Head, ...rest: infer Rest]
        ? Head extends [_: infer Key, __: infer Value]
            ? Key extends string 
                ? Record<Key, Value> & MergeResult<Rest>
                : 'Key should be string'
            : 'Item should be tuple key-value'
        // eslint-disable-next-line @typescript-eslint/ban-types
        : {};

const merge = <T extends Array<MergeItem<any, R>>, R extends string>(...args: T): MergeResult<T> => 
    args.reduce((acc, [name, value]) => ({...acc, ...{[name]: value}}), {}) as MergeResult<T>;


const res = merge(['val', 1], ['foo', true], ['bar', 'val']);


type mergeResultEx = MergeResult<[['a', number], ['b', string]]>

//SAME but fro Options!

type OptionMergeItem<T extends Option<any>, Y extends string = string> = [Y, T];

type OptionMergeResult<T> = 
    T extends [x: infer Head, ...rest: infer Rest]
        ? Head extends [_: infer Key, __: infer Value]
            ? Key extends string 
                ? ((_: Value) => any) extends ((_: Option<infer OptionValue>) => any)
                    ? Record<Key, OptionValue> & OptionMergeResult<Rest>
                    : 'Value should be Option'
                : 'Key should be string'
            : 'Item should be tuple key-value'
        // eslint-disable-next-line @typescript-eslint/ban-types
        : {};

type optionMergeResultEx = OptionMergeResult<[['a', Option<number>], ['b', Option<string>]]>

const optionMerge = <T extends Array<OptionMergeItem<any>>>(...args: T): Option<OptionMergeResult<T>> => 
    args.reduce((acc, [name, value]) => {
        return pipe(
            sequenceT(option.Apply)(acc, value),
            option.map(([a, b]) => ({...a, ...{[name]: b}}))
        )
    }
    , some({})) as Option<OptionMergeResult<T>>;

const optiRes = optionMerge(['val', some(1)], ['foo', some(true)], ['bar', some('val')]);