import { boolean } from "fp-ts";

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
const mergeObject01 = mergeTuple('some', 'val')(1, 'ss');

const asTupleOfLiterals= <T extends string, U extends [T, ...T[]]>(tuple: U):  U => tuple;

const vall = asTupleOfLiterals(['some', 'val']);




type TupleUnion<T extends Array<any>> = T extends [head: infer THead, ...rest: infer TTail] 
    ? TTail extends Array<any> 
        ? Omit<THead, keyof TupleUnion<TTail>>  extends THead
                ? THead & TupleUnion<TTail>
            : 'COLLISION ERROR'
        : THead
    // eslint-disable-next-line @typescript-eslint/ban-types
    : {};

const union = <T extends Array<any>>(...items: T): TupleUnion<T> => items.reduce((acc, cur) => ({...acc, ...cur}), {})

const tt = union({a: 1}, {b: 'asdas', a: boolean});

const aa = {a: 1}
const bb = {a: 1, b: true}

type tt = Omit<typeof bb, keyof typeof aa>;
