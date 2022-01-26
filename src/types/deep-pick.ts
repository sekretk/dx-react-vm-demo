import { IsTrue, IfStrictEquals, IsFalse } from "./test-utils";

type DataProps<T> = {
    [K in keyof T]: T[K] extends (...x: any) => any ? never : K
}[keyof T];

type TISSUER_01 = {
    a: number,
    b: () => void
}

type TISSUER_02 = {
    a: number,
    b: () => void,
    c: Array<number>
}

export type TYPES_TEST_SUITE_DataProps = [
    IsTrue<IfStrictEquals<DataProps<TISSUER_01>, 'a'>>,
]

type SEPARATOR = '.';

type InnerPath<T, K extends keyof T> = K extends string ? `${K}${SEPARATOR}${keyof T[K] & string}` | `${K}.${InnerPath<T[K], keyof T[K]>}` : never;

type Path<T> = keyof T | InnerPath<T, keyof T>;

type issuer = {
    a: string,
    b: {
        c: boolean,
        d: number
    }
}

const ttt: Path<issuer> = 'b.d.toFixed';

export type TYPES_TEST_SUITE_Path = [
    IsTrue<IfStrictEquals<ResolveMarble<'AB'>, Record<'A' | 'B', any>>>,
    IsFalse<IfStrictEquals<ResolveMarble<'AB'>, Record<'A' | 'B' | 'C', any>>>
]

//TODO: 'a.b.c' -> Option<T[a][b][c]> if any of values undefined or Option
//TODO: filter out functions types? it's too tempting to say so!
//TODO: 'a[number]' -> should it work, open question?