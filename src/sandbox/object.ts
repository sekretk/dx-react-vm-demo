import { pipe } from "fp-ts/lib/function";

export const get = <T, K extends keyof T>(key: K) => (item: T): T[K] => item[key];
pipe(
    {a: 'hello', b: 'bye'},
    get('a')
)

//with DOT notation
//export const get = ????
// pipe(
//     {a: 'hello', b: {c: 'bye'}},
//     get('b.c')
// )

//with DOT notation and Option/nullable
//export const get = ?????
// pipe(
//     {a: 'hello', b: {c: 'bye', d: some({k: 1})}},
//     get('b.d.k') => Option<number>
// )
// Should Wrap undefined to Option
// pipe(
//     {a: 'hello', b: {c: 'bye', d?: {k: 1})},
//     get('b.d.k') => Option<number>
// )

//with DOT notation and Option/nullable with partial selection
//export const get = ?????
// pipe(
//     {a: 'hello', t: 1, b: {c: 'bye', d: some({k: 1})}},
//     get(a, 'b.d.k') => {a: string, b: {d: Option<{k: number}>}}
// )