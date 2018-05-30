import { EditorState } from 'prosemirror-state';
import { ResolvedPos } from 'prosemirror-model';

export const getStartOfCurrentLine = (state: EditorState) => {
  const { $from } = state.selection;
  return getStartOfLine($from);
};

export const getStartOfLine = ($pos: ResolvedPos) => {
  if ($pos.nodeBefore && $pos.nodeBefore.isText) {
    const prevNewLineIndex = $pos.nodeBefore.text!.lastIndexOf('\n');
    return {
      text: $pos.nodeBefore.text!.substring(prevNewLineIndex + 1),
      pos: $pos.start() + prevNewLineIndex + 1,
    };
  }
  return { text: '', pos: $pos.pos };
};

export const getEndOfCurrentLine = (state: EditorState) => {
  const { $to } = state.selection;
  return getEndOfLine($to);
};

export const getEndOfLine = ($pos: ResolvedPos) => {
  if ($pos.nodeAfter && $pos.nodeAfter.isText) {
    const nextNewLineIndex = $pos.nodeAfter.text!.indexOf('\n');
    return {
      text: $pos.nodeAfter.text!.substring(
        0,
        nextNewLineIndex >= 0 ? nextNewLineIndex : undefined,
      ),
      pos: nextNewLineIndex >= 0 ? $pos.pos + nextNewLineIndex : $pos.end(),
    };
  }
  return { text: '', pos: $pos.pos };
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

const SPACE = { token: ' ', size: 2, regex: /[^ ]/ };
const TAB = { token: '\t', size: 1, regex: /[^\t]/ };
export const getLineInfo = (line: string) => {
  const indentToken = line.startsWith('\t') ? TAB : SPACE;
  const indentLength = line.search(
    indentToken.token === '\t' ? indentToken.regex : indentToken.regex,
  );
  const indentText = line.substring(0, indentLength);
  return { indentToken, indentText };
};
