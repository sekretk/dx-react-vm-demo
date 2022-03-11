import { FunctionN, pipe } from "fp-ts/lib/function"
import { Predicate } from "fp-ts/lib/Predicate";
import { IfExtends } from "./compare";

export type Guard<T, R extends T> = (val: T) => val is R;

export type IfExact<TLeft, TRight, TIfExact, TIfNot = false> =
IfExtends<TLeft, TRight, IfExtends<TRight, TLeft, TIfExact, TIfNot>, TIfNot>

export type Branch<Tin, Tout, Tnarrow = never> = IfExact<Tin, Tnarrow, {
    map: (_: Tnarrow) => Tout
}, {
    narrow: <K extends Exclude<Tin, Tnarrow>>(refine: Guard<Exclude<Tin, Tnarrow>, K>, project: (_: K) => Tout) => Branch<Tin, Tout, Tnarrow | K>
}>

class BranchInstance<T, R> {
 
    private projects: Array<[Predicate<T>, FunctionN<[T], R>]> = [];
 
    constructor(projects: Array<[Predicate<T>, FunctionN<[T], R>]>){
        console.log('XXX', projects);
        this.projects = projects;
    }
 
    map = (val: T): R => {
        const project = this.projects.find(_ => _[0](val));

        if (project === undefined) {
            throw new Error(`[BranchInstance] refinment predicate return false for provided item: ${JSON.stringify(val)}`)
        }

        return project[1](val) as R;
    }
    
    narrow = (refine: Predicate<T>, projection: FunctionN<[T], R>) => new BranchInstance([...this.projects, [refine, projection]]);
}
 
export const branch = <Tin, Tout>(): Branch<Tin, Tout> => new BranchInstance([]) as unknown as Branch<Tin, Tout>;

//new BranchInstance<string, number>([]).map