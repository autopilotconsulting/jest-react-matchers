import groupArray from '../../lib/groupArray';

describe('groupArray', () => {
  const sampleData = [1, 2, 3, 4, 5, 6, 7];

  it('should return the array by selector', () => {
    const selector = (element) => element % 3;
    const result = groupArray(sampleData, selector);

    const expected = { 0: [3, 6], 1: [1, 4, 7], 2: [2, 5] };
    expect(result).toEqual(expected);
  });

  it('should return the array by predicate', () => {
    const predicate = (element) => element % 2 === 0;
    const { true: passed, false: failed } = groupArray(sampleData, predicate);

    expect(passed).toEqual([2, 4, 6]);
    expect(failed).toEqual([1, 3, 5, 7]);
  });
});