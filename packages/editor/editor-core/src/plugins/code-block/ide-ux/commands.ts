import { EditorState, TextSelection } from 'prosemirror-state';

import {
  getLinesFromSelection,
  getLineInfo,
  forEachLine,
  getStartOfCurrentLine,
} from './line-handling';
import { analyticsService } from '../../../analytics';

export function indent(state: EditorState, dispatch) {
  const { text, start } = getLinesFromSelection(state);
  const { tr, selection } = state;
  forEachLine(text, (line, offset) => {
    const { indentText, indentToken } = getLineInfo(line);
    const indentToAdd = indentToken.token.repeat(
      indentToken.size - indentText.length % indentToken.size ||
        indentToken.size,
    );
    tr.insertText(indentToAdd, tr.mapping.map(start + offset, -1));
    if (!selection.empty) {
      tr.setSelection(
        TextSelection.create(
          tr.doc,
          tr.mapping.map(selection.from, -1),
          tr.selection.to,
        ),
      );
    }
  });
  dispatch(tr);
  analyticsService.trackEvent(`atlassian.editor.codeblock.indent`);
  return true;
}

export function outdent(state: EditorState, dispatch) {
  const { text, start } = getLinesFromSelection(state);
  const { tr } = state;
  forEachLine(text, (line, offset) => {
    const { indentText, indentToken } = getLineInfo(line);
    if (indentText) {
      const unindentLength =
        indentText.length % indentToken.size || indentToken.size;
      tr.delete(
        tr.mapping.map(start + offset),
        tr.mapping.map(start + offset + unindentLength),
      );
    }
  });
  dispatch(tr);
  analyticsService.trackEvent('atlassian.editor.codeblock.outdent');
  return true;
}

export function insertIndent(state: EditorState, dispatch) {
  const { text: textAtStartOfLine } = getStartOfCurrentLine(state);
  const { indentToken } = getLineInfo(textAtStartOfLine);
  const indentToAdd = indentToken.token.repeat(
    indentToken.size - textAtStartOfLine.length % indentToken.size ||
      indentToken.size,
  );
  dispatch(state.tr.insertText(indentToAdd));
  analyticsService.trackEvent('atlassian.editor.codeblock.indent.insert');
  return true;
}

export function insertNewlineWithIndent(state: EditorState, dispatch) {
  const { text: textAtStartOfLine } = getStartOfCurrentLine(state);
  const { indentText } = getLineInfo(textAtStartOfLine);
  if (indentText) {
    dispatch(state.tr.insertText('\n' + indentText));
    return true;
  }
  return false;
}
