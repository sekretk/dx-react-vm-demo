import { cold, hot, Scheduler } from "jest-marbles";
import { interval, of } from "rxjs";
import { TestScheduler } from "rxjs/internal/testing/TestScheduler";
import { concatMap, delay, filter, map, mapTo, mergeMap, switchMap, take, throttleTime } from "rxjs/operators";
describe('RXTEstCase', () => {

    const testScheduler = () =>
	new TestScheduler((actual, expected) => {
		expect(actual).toEqual(expected);
	});


    it('Switch map WORKING outside of scheduler scope', () => {
        const obs1 = hot('--A-A');
        const obs2 = cold('-B');
        obs1.pipe(switchMap(() => obs2)).subscribe();
        //expect(obs1.pipe(switchMap(() => obs2))).toBeObservable(cold('---B-B'));
        expect(obs2).toHaveSubscriptions(['--^-!', '-----']);
    });
    
    //Here all '-' is collapsed
    it('Switch map NOT WORKING in scheduler run', () => {
        Scheduler.get().run(() => {
            const obs1 = hot('--A-A');
            const obs2 = cold('-B');
            obs1.pipe(switchMap(() => obs2)).subscribe();
            //expect(obs1.pipe(switchMap(() => obs2))).toBeObservable(cold('---B-B'));
            expect(obs2).toHaveSubscriptions(['--^-!', '------------^']);
        });
    });
    
    it('Switch map test example', () => {
        testScheduler().run((helpers) => {
            const { cold, hot, expectSubscriptions } = helpers;
            const obs1 = hot('--A-A');
            const obs2 = cold('-B');
    
            obs1.pipe(switchMap(() => obs2)).subscribe();
            expectSubscriptions(obs2.subscriptions).toBe(['--^-!', '----^']);
        });
    });
    
    it('generates the stream correctly', () => {
        testScheduler().run((helpers) => {
            const { cold, expectObservable, expectSubscriptions } = helpers;
            const e1 = cold(' -a--b--c---|');
            const e1subs = '  ^----------!';
            const expected = '-a-----c---|';
    
            expectObservable(e1.pipe(throttleTime(3))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
})

//https://stackblitz.com/edit/jasmine-marbles-testing

describe('Marble testing operators', () => {

    describe('Map', () => {
      it('should add "1" to each value emitted', () => {
        const values = { a: 1, b: 2, c: 3, x: 2, y: 3, z: 4 };
        const source = cold('-a-b-c-|', values);
        const expected = cold('-x-y-z-|', values);
  
        const result = source.pipe(map(x => x+1));
        expect(result).toBeObservable(expected);
      });
    });
  
    describe('MapTo', () => {
      it('should map every value emitted to "surprise!"', () => {
        const values = { a: 1, b: 2, c: 3, x: 'surprise!' };
        const source = cold('-a-b-c-|', values);
        const expected = cold('-x-x-x-|', values);
  
        const result = source.pipe(mapTo('surprise!'));
        expect(result).toBeObservable(expected);
      });
    });
  
    describe('MergeMap', () => {
      it('should maps to inner observable and flattens', () => {
        const values = { a: 'hello', b: 'world', x: 'hello world' };
        const obs1 = cold(    '-a-------a--|', values);
        const obs2 = cold(    '-b-b-b-|', values);
        const expected = cold('--x-x-x---x-x-x-|', values);
  
        const result = obs1.pipe(mergeMap(x => obs2.pipe(map(y => x + ' ' + y))));
        expect(result).toBeObservable(expected);
      });
    });
  
    describe('SwitchMap', () => {
      it('should maps each value to inner observable and flattens', () => {
        const values = { a: 10, b: 30, x: 20, y: 40 };
        const obs1 = cold(    '-a-----a--b-|', values);
        const obs2 = cold(    'a-a-a|', values);
        const expected = cold('-x-x-x-x-xy-y-y|', values);
  
        const result = obs1.pipe(switchMap(x => obs2.pipe(map(y => x + y))));
        expect(result).toBeObservable(expected);
      });
    });
  
    describe('ConcatMap', () => {
      it('should maps values to inner observable and emits in order', () => {
        const values = { a: 10, b: 30, x: 20, y: 40 };
        const obs1 = cold(    '-a--------b------ab|', values);
        const obs2 = cold(    'a-a-a|', values);
        const expected = cold('-x-x-x----y-y-y--x-x-xy-y-y|', values);
  
        const result = obs1.pipe(concatMap(x => obs2.pipe(map(y => x + y))));
        expect(result).toBeObservable(expected);
      });
    });
  });


  describe('Marbe testing with time', () => {
    describe('Interval', () => {
      it('should keeps only even numbers', () => {
        const source = interval(10, Scheduler.get()).pipe(
          take(10),
          filter(x => x % 2 === 0),
        );
        const expected = cold('-a-b-c-d-e|', { a: 0, b: 2, c: 4, d: 6, e: 8 });
  
        expect(source).toBeObservable(expected);
      });
    });
  
    describe('Delay', () => {
      it('should waits 20 frames before receive the value', () => {
        const scheduler = Scheduler.get();
        const source = of('a').pipe(
          delay(20, scheduler),
        );
        const expected = cold('--(a|)');
  
        expect(source).toBeObservable(expected);
      });
    });
  });