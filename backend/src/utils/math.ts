export const mean = (nums: number[]) => {
  const sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length || 0;
};
