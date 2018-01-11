export function checkClipboardTypes(
  type: DOMStringList | Array<string>,
  item: string,
) {
  const isDOMStringList = (t): t is DOMStringList => !t.indexOf && !!t.contains;
  return isDOMStringList(type) ? type.contains(item) : type.indexOf(item) > -1;
}

export function isPastedFile(e: ClipboardEvent) {
  return checkClipboardTypes(e.clipboardData.types, 'Files');
}
