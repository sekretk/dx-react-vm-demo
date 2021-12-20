class SimpleMapper<T = never> {

    private _val: T;
    
    private constructor(val: T) {
        this._val = val;
    }

    public static init = <R>(val: R) => new SimpleMapper(val);

    public map = <K extends keyof T, R extends string>(from: K, to: R): SimpleMapper<Omit<T, K> & Record<R, T[K]>> => {
        const newVal = this._val;
        delete newVal[from];
        return new SimpleMapper({...newVal, ...{[to]: this._val[from]} as Record<R, T[K]>});
    }

    public get value() {
        return this._val;
    }
}

const result = SimpleMapper.init({a: 1, b: 'hello'}).map('a', 'AA').value;