import { is } from "ramda"
import { branch } from "./narrow"

describe('branch', () => {
    type A = {
        tag: 'A',
        val: number
    }
    
    type B = {
        tag: 'B',
        val: string
    }
    

    type C = {
        tag: 'C',
        val: boolean,
    }

    type ALL_IN_ONE = A | B// | C;
    
    const val_01: ALL_IN_ONE = {
        tag: 'A',
        val: 1
    }

    const val_02: ALL_IN_ONE = {
        tag: 'B',
        val: '22'
    }
    
    const isA = (val: ALL_IN_ONE): val is A => val.tag === 'A';
    const isB = (val: ALL_IN_ONE): val is B => val.tag === 'B';

    //const project = branch<A | B, string>().narrow(isA, _ => _.val.toString()).narrow(isB, _ => _.val);

    const project = branch<ALL_IN_ONE, string>()
        .narrow(isA, _ => _.val.toString())
        .narrow(isB, _ => _.val).map

//     const project = (val: A | B): string => {
// if (isA(val)) {
//     return val.val.toString();
// }

// if (isB(val)) {
//     return val.val;
// }

// return '';

//     }




    it('Should Work for A', () => {
        expect(project(val_01)).toStrictEqual('1');
    });

    it('Should Work for B', () => {
        expect(project(val_02)).toStrictEqual('22');
    });
})