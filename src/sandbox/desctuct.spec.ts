import { swapInArray } from "./destruct"

describe('descruct module', () => {
    describe('swap function', () => {
        it('should swap', () => {
            expect(swapInArray([1,2,3,4], 2,3)).toEqual([1,2,4,3])
        })
    })
})