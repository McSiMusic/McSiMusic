export interface Range {
    start: number;
    end: number;
}

export const isInRange = (value: number, range: Range) => {
    const { start, end } = range;
    if (start === end) return false
    const max = Math.max(start, end);
    const min = Math.min(start, end);
    return value > min && value < max;
}