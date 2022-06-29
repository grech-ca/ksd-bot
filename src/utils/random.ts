export const random = <T>(arr: T[]): T => {
  const size = arr.length;
  return arr[Math.round(Math.random() * (size - 1))];
};
