import { some } from "fp-ts/lib/Option"
import { grandOptionCompact } from "./option.play"

describe('option.play module test suite', () => {
    it('should unwrapp Options', () => {
        expect(grandOptionCompact(some(some(some(42))))).toEqual(42);
    })
})