export type TypeCheckError<T extends string> = {
    Error: T
}

export type KeyValueTuple<T, Y extends string> = [Y, T];