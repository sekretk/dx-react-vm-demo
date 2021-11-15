export type IsTrue<T extends true> = T;
export type IsFalse<T extends false> = T;

export type IfStrictEquals<T, U, TOnTrue = true, TOnFalse = false> =
  (<G>() => G extends T ? 1 : 2) extends
  (<G>() => G extends U ? 1 : 2) ? TOnTrue : TOnFalse;