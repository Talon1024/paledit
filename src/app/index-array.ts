export function indexArray(count: number): number[] {
  const arr = new Array(count);
  for (let i = 0; i < count; i++) {
    arr[i] = i;
  }
  return arr;
}
