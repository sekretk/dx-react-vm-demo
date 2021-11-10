
class Mamal { private _:undefined }
class Animal extends Mamal { x:undefined }
class Dog extends Animal { d: undefined }

type BivariantEventHandler<E extends Animal> = { bivarianceHack(event: E): void }["bivarianceHack"];
type EventHandler<E extends Animal> = (event: E) => void

const o: EventHandler<Animal> = (o: Dog) => { console.log(o.d) } // fails under strictFunctionTypes: true
const o2: BivariantEventHandler<Animal> = (o: Dog) => { console.log(o) } // still ok  under strictFunctionTypes 

const b01: EventHandler<Dog> = (o: Animal) => { console.log(o.x) }
const b02: BivariantEventHandler<Dog> = (o: Animal) => { console.log(o.x) }

type IsSubtypeOf<S, P> = S extends P ? true : false;

type T11 = IsSubtypeOf<Dog, Animal>; //TRUE
type T12 = IsSubtypeOf<Animal, Dog>; //FALSE

type T21 = IsSubtypeOf<Promise<Dog>, Promise<Animal>> //TRUE
type T22 = IsSubtypeOf<Promise<Animal>, Promise<Dog>> //FALSE

type Func<Param> = (param: Param) => void;

type T31 = IsSubtypeOf<Func<Dog>, Func<Animal>> //false on strictFunctionTypes: true!!!
type T32 = IsSubtypeOf<Func<Animal>, Func<Dog>> //true

type BivariantFunc<E extends Animal> = { bivarianceHack(event: E): void }["bivarianceHack"];

type T41 = IsSubtypeOf<BivariantFunc<Dog>, BivariantFunc<Animal>>
type T42 = IsSubtypeOf<BivariantFunc<Animal>, BivariantFunc<Dog>>
type T43 = IsSubtypeOf<BivariantFunc<Mamal>, BivariantFunc<Dog>>

type Trans<Param, Result> = (param: Param) => Result;