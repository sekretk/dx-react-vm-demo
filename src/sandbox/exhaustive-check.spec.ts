import {matchConfig} from '@babakness/exhaustive-type-checking';

describe('test for different exhaustive check modes', () => {

    type Fruit = 'banana' | 'orange' //| 'the_new_one';

    describe('external @babakness/exhaustive-type-checking', () => {

        

        it('matchConfig helper', () => {
            const result = matchConfig<Fruit>()({
                'banana': () => '_none',
                'orange': () => '_done'
            });

            expect(result('banana')).toEqual('_none');
        });
    })

    describe('native implementation', () => {

        const exhaustiveCheck = (value: never) => value;

        function makeDessert(fruit: Fruit) {
            switch (fruit) {
                case 'banana': return 'Banana Shake'
                case 'orange': return 'Orange Juice'
            }
            exhaustiveCheck(fruit)
        }

        it('Exhaustive branching with record', () => {
            const mapper: Record<Fruit, number> = {
                'banana': 1,
                'orange': 2
            }

            expect(mapper['banana']).toEqual(1);
        } );

        it('Branching check via type narrowing', () => {
            expect(makeDessert('banana')).toEqual('Banana Shake');
        })
    })
})