export type TypeError<T extends string> = {
    Error: T
}