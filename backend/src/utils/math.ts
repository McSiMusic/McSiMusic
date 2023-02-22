export const mean = (nums: number[]) => {
  const sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length || 0;
};

export const absMean = (nums: number[]) => {
  const sum = nums.reduce((a, b) => a + Math.abs(b), 0);
  return sum / nums.length;
};

export const squareMean = (nums: number[]) => {
  const sum = nums.reduce((a, b) => a + b*b, 0);
  return Math.sqrt(sum / nums.length || 0);
};
