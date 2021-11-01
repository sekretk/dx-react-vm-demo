export type Flavored<A, Tag extends string> = A & { _flavor: Uppercase<Tag> };
export const FlavoredFabric1 = <S extends string>(_s: S) => <T>(val: T): Flavored<T, S> => val as Flavored<T, S>;

export type Tenor = Flavored<string, 'Tenor'>;
const TenorFabric = FlavoredFabric1('Tenor');

const result = TenorFabric('some')

const consumer = (val: Tenor) => { console.log(val)};

consumer(result);