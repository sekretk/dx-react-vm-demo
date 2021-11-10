type UnCurry<T, Thead extends any[] = []> =
    T extends (_: infer A) => (__: infer B) => infer R
        ? UnCurry<(_: B) => R, [...Thead, A]>
        : T extends (_: infer A) => infer R
            ? (..._: [...Thead, A]) => R
            : never;

//internal JS implementation
const uncurry = (fn, n = 1) => (...args) => {
    const next = acc => args => args.reduce((x, y) => x(y), acc);
    if (n > args.length) throw new RangeError('Arguments too few!');
    return next(fn)(args.slice(0, n));
};

//uncurry implementation
const unCurryFunction = <T>(func: T): UnCurry<T> => uncurry(func) as UnCurry<T>;

//const curFunc = (a: string) => (b: number) => (c: boolean) => 'string';
//chech type
//type TUncurryIssue = UnCurry<typeof curFunc>;

//Check function
const issueFunction = (a: string) => (b: boolean) => (c: number) => a + b + c;
const middleFunc = unCurryFunction(issueFunction);
const result = middleFunc('hello', true, 42);

export const tupleArgs = <A extends Array<unknown>, R>(func: (...args: A) => R): ((args: A) => R) => args => func(...args);
