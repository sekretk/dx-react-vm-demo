import { none, some } from "fp-ts/lib/Option";
import { getFilteredHeader } from "./array.play";

expect(
    getFilteredHeader(some({f: some({a: '1', b: 2 }), s: some({a: '1', b: 3})}))
).toEqual(
    none
);

expect(
    getFilteredHeader(some({f: some({a: '1', b: 2 }), s: some({a: '1', b: 5})}))
).toEqual(
    some({a: '1', b: 5})
);