export function parseWhitespace(
  input: string,
  lineBreakOnly: boolean = false,
): number {
  let index = 0;
  const char = input.charAt(index);

  if (char === '\r') {
    // CR (Unix)
    index++;
    if (input.charAt(index) === '\n') {
      // CRLF (Windows)
      index++;
    }
  } else if (char === '\n') {
    // LF (MacOS)
    index++;
  } else if (!lineBreakOnly && (char === '\t' || char === ' ')) {
    index++;
  }
  return index;
}
