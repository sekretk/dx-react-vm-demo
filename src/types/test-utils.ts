export type IsTrue<T extends true> = T;
export type IsFalse<T extends false> = T;

export type IfStrictEquals<T, U, TOnTrue = true, TOnFalse = false> =
  [U] extends [T] ? [T] extends [U] ? TOnTrue : TOnFalse : TOnFalse;