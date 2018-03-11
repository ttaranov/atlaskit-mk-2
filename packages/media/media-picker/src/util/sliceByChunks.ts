export function sliceByChunks(array: any[], maxSize: number): any[][] {
  const chunks: any[][] = [];
  for (let i = 0; i < array.length; i += maxSize) {
    chunks.push(array.slice(i, i + maxSize));
  }
  return chunks;
}
