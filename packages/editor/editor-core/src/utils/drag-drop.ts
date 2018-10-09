export function isDroppedFile(rawEvent: Event): boolean {
  const { dataTransfer } = rawEvent as DragEvent;
  if (!dataTransfer) {
    return false;
  }
  return Array.prototype.slice.call(dataTransfer.types).indexOf('Files') !== -1;
}
