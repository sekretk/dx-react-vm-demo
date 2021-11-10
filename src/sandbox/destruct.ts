export const swapInArray = <T>(arr: ReadonlyArray<T>, idx1: number, idx2: number): Array<T> => {
    const result = [...arr];
    [result[idx1], result[idx2]] = [arr[idx2], arr[idx1]]
    return result;
}