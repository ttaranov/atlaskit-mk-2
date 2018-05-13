import { EditorState } from 'prosemirror-state';

export const getStartOfCurrentLine = (state: EditorState) => {
  const { $from } = state.selection;
  if ($from.nodeBefore && $from.nodeBefore.isText) {
    const prevNewLineIndex = $from.nodeBefore.text!.lastIndexOf('\n');
    return {
      text: $from.nodeBefore.text!.substring(prevNewLineIndex + 1),
      pos: $from.start() + prevNewLineIndex + 1,
    };
  }
  return { text: '', pos: $from.pos };
};

export const getEndOfCurrentLine = (state: EditorState) => {
  const { $to } = state.selection;
  if ($to.nodeAfter && $to.nodeAfter.isText) {
    const nextNewLineIndex = $to.nodeAfter.text!.indexOf('\n');
    return {
      text: $to.nodeAfter.text!.substring(
        0,
        nextNewLineIndex >= 0 ? nextNewLineIndex : undefined,
      ),
      pos: nextNewLineIndex >= 0 ? $to.pos + nextNewLineIndex : $to.end(),
    };
  }
  return { text: '', pos: $to.pos };
};

export function getLinesFromSelection(state: EditorState) {
  const { pos: start } = getStartOfCurrentLine(state);
  const { pos: end } = getEndOfCurrentLine(state);
  const text = state.doc.textBetween(start, end);
  return { text, start, end };
}

export const forEachLine = (
  text: string,
  callback: (line: string, offset: number) => void,
) => {
  let offset = 0;
  text.split('\n').forEach(line => {
    callback(line, offset);
    offset += line.length + 1;
  });
};

const TAB_REGEX = /[^\t]/;
const SPACES_REGEX = /[^ ]/;
export const getLineInfo = (line: string) => {
  const indentToken = line.startsWith('\t') ? '\t' : '  ';
  const indentLength = line.search(
    indentToken === '\t' ? TAB_REGEX : SPACES_REGEX,
  );
  const indentText = indentLength >= 0 ? line.substring(0, indentLength) : '';
  return { indentToken, indentText };
};
