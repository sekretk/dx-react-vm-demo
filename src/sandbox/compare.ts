/* eslint-disable @typescript-eslint/ban-types */

type IN_COVERED_OUT_NOT = 'ALL PROPS IN SOURCE ARE USED BUT NOT IN DESTINATION';
type SOURCE_NOT_COVERED = 'NOT ALL PROPERTIES FROM SOURCE USED';
type MAPPED_TO_EXTRA_PROPERTIES<T> = {text: 'EXTRA PROPERTIES IN RESULT', props: T};

/**
 * If TRight extends TLeft type returns TIfIncludes
 * overwise return TIfNot
 */
 export type IfIncludes<TLeft, TRight, TIfIncludes, TIfNot = never> = IfExtends<TRight, TLeft, TIfIncludes, TIfNot>;

/**
 * If TLeft extends TRight type returns TIfExtends
 * overwise return TIfNot
 */
 export type IfExtends<TLeft, TRight, TIfExtends, TIfNot = false> =
    [TLeft] extends [TRight]
     ? TIfExtends
     : TIfNot;


export type IfExact<TLeft, TRight, TIfExact, TIfNot = false> =
IfExtends<TLeft, TRight, IfExtends<TRight, TLeft, TIfExact, TIfNot>, TIfNot>

export type IfShallowExact<T01, T02, TY, TN> = IfExact<keyof T01, keyof T02, TY, TN>;
 
export type PartialComparer<Tin, Tout, TinTemp extends Partial<Tin> = {}, ToutTemp = {}> =
    IfShallowExact<
        Tin,
        TinTemp,
        IfIncludes<
            FlatRequired<Tout>,
            ToutTemp,
            {
                result: TransformAction<TinTemp, ToutTemp>,
            },
            {
                msg: IN_COVERED_OUT_NOT
            }
        >,
        IfSubsetKeys<
            Tout, 
            ToutTemp, 
            {
                msg: SOURCE_NOT_COVERED,
                map<K extends Exclude<keyof Tin, keyof TinTemp>, R extends Partial<Omit<Tout, keyof ToutTemp>>>(
                    key: K,
                    value: TransformAction<Tin[K], R>):
                    Mapper<Tin, Tout, TinTemp & Record<K, Tin[K]>, ToutTemp & R>
            },
            {
                msg: MAPPED_TO_EXTRA_PROPERTIES<Exclude<keyof ToutTemp, keyof Tout>>
            }
        >
        
    >;

type TIssue01 = { a: number, b: boolean };

type TIssue02 = {a: number, b: string};

type TIssueInWithOptional = { a: number, b?: boolean };

type TIssueOutWithLiteral = {a: number, b: 'some text'};

type _TEST_SUITE = [
    IsTrue<IfExtends<Mapper<TIssue01, TIssue02>, { msg: SOURCE_NOT_COVERED }, true>>,
    IsTrue<IfExtends<Mapper<TIssue01, TIssue02, { a: any }, { a: number }>, { msg: SOURCE_NOT_COVERED }, true>>,
    IsTrue<IfExtends<Mapper<TIssue01, TIssue02, Record<keyof TIssue01, any>, { a: number }>, { msg: IN_COVERED_OUT_NOT }, true>>,
    IsTrue<IfExact<Mapper<TIssue01, TIssue02, Record<keyof TIssue01, any>, { a: number, b: string }>, { result: TransformAction<TIssue01, TIssue02> }, true>>,
    IsTrue<IfExtends<Mapper<TIssueInWithOptional, TIssue02, {a: number}>, { msg: SOURCE_NOT_COVERED }, true>>,
    IsTrue<IfExtends<Mapper<TIssue01, TIssue02, Record<keyof TIssue01, any>, TIssueOutWithLiteral>, { result: TransformAction<TIssue01, TIssue02> }, true>>,
    IsTrue<IfExtends<Mapper<TIssue01, TIssue02, { a: any }, { a: number, DELETE_ME: any }>, { msg: MAPPED_TO_EXTRA_PROPERTIES<'DELETE_ME'> }, true>>,
]