import { IfStrictEquals, IsTrue } from "./test-utils"

export type Replace<T, K extends keyof T, R extends Record<K, any>> = {
    [Key in keyof T]: Key extends K ? R[Key] : T[Key]
}

export type ReplaceOne<T, K extends keyof T, R> = {
    [Key in keyof T]: Key extends K ? R : T[Key]
}

type ISSUE_TYPE = {
    a: string,
    b: number
}

type TEST_SUITE = [
    IsTrue<IfStrictEquals<ReplaceOne<ISSUE_TYPE, 'a', number>, Record<keyof ISSUE_TYPE, number>>>,
    IsTrue<IfStrictEquals<Replace<ISSUE_TYPE, 'a' | 'b', {a: boolean, b: boolean}>, Record<keyof ISSUE_TYPE, boolean>>>,
]
