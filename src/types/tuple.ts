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






