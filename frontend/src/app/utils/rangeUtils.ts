export interface Range {
    start: number;
    end: number;
}

export const isInRange = (value: number, range: Range, inclusive = false) => {
    const { start, end } = range;
    if (start === end) return false
    const { start: min, end: max  } = getNormalizedRange(range);
    return inclusive ? value >= min && value <= max : value > min && value < max;
}

export const intersection = (range1: Range, range2: Range): Range | null => {
    const { start: min1, end: max1 } = getNormalizedRange(range1)
    const { start: min2, end: max2 } = getNormalizedRange(range2)

    if (!isInRange(min1, range2) && !isInRange(max1, range2))
        return null;

    return { start: Math.max(min1, min2), end: Math.min(max1, max2) }
}

export const getNormalizedRange = (range: Range) => {
    const { start, end } = range;
    return { start: Math.min(start, end), end: Math.max(start, end) }
}

export const addToRange = (range: Range, add: number, limitingRange?: Range): Range => {
    if (add === 0)
        return range;

    const { start, end } = range;

    if (!limitingRange) return {
        start: start + add,
        end: end + add
    };

    const { start: nStart, end: nEnd } = getNormalizedRange(range);
    const { start: nlStart, end: nlEnd } = getNormalizedRange(limitingRange);

    if (nlEnd - nlStart < nEnd - nStart) {
        throw new Error("addToRange: Limiting range is less than given");
    }      

    if (nStart + add < nlStart) {
        add = nlStart - nStart;
    } else if (nEnd + add > nlEnd) {
        add = nlEnd - nEnd;
    }

    return addToRange(range, add)
}