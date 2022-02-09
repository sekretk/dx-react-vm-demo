import { enumStringBody } from "@babel/types";

const func = (value: string) => (int: number) => (rr: string) => (ttt: boolean): boolean => false;

type UltimateReturn<T extends (..._: any) => any> = 
    [ReturnType<T>] extends [(..._: any) => any] 
        ? UltimateReturn<ReturnType<T>>
        : ReturnType<T>;

type rrr = UltimateReturn<typeof func>;