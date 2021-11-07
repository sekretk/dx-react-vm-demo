import { Option, some } from 'fp-ts/Option';
import { option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';
import { KeyValueTuple, TypeCheckError } from '../types/generic';
import { OptionMergeResult } from '../types/option.utils';

type MergeResult<T> = 
    T extends [x: infer Head, ...rest: infer Rest]
        ? Head extends [_: infer Key, __: infer Value]
            ? Key extends string 
                ? Record<Key, Value> & MergeResult<Rest>
                : TypeCheckError<'Key should be string'>
            : TypeCheckError<'Item should be tuple key-value'>
        // eslint-disable-next-line @typescript-eslint/ban-types
        : {};

const merge = <T extends Array<KeyValueTuple<any, R>>, R extends string>(...args: T): MergeResult<T> => 
    args.reduce((acc, [name, value]) => ({...acc, ...{[name]: value}}), {}) as MergeResult<T>;


const res = merge(['val', 1], ['foo', true], ['bar', 'val']);


type mergeResultEx = MergeResult<[['a', number], ['b', string]]>


