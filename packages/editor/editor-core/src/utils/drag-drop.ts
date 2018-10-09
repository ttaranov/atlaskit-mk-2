export function isDroppedFile(e: DragEvent): boolean {
  return (
    Array.prototype.slice.call(e.dataTransfer.types).indexOf('Files') !== -1
  );
}
