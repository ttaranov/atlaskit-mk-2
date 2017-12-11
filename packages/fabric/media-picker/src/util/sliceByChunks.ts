export const sliceByChunks = function(
  array: Array<any>,
  maxSize: number,
): Array<Array<any>> {
  const chunks = [];
  for (let i = 0; i < array.length; i += maxSize) {
    chunks.push(array.slice(i, i + maxSize));
  }
  return chunks;
};
