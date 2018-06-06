import { EditorState, TextSelection, Plugin } from 'prosemirror-state';
import { keydownHandler } from 'prosemirror-keymap';
import {
  getLinesFromSelection,
  getStartOfCurrentLine,
  forEachLine,
  getLineInfo,
} from '../ide-ux/line-handling';
import { getCursor } from '../../../utils';

const isSelectionEntirelyInsideCodeBlock = (state: EditorState): boolean =>
  state.selection.$from.sameParent(state.selection.$to) &&
  state.selection.$from.parent.type === state.schema.nodes.codeBlock;

const isCursorInsideCodeBlock = (state: EditorState): boolean =>
  !!getCursor(state.selection) && isSelectionEntirelyInsideCodeBlock(state);

export default new Plugin({
  props: {
    handleKeyDown: keydownHandler({
      Enter: (state: EditorState, dispatch) => {
        if (isCursorInsideCodeBlock(state)) {
          const { text: textAtStartOfLine } = getStartOfCurrentLine(state);
          const { indentText } = getLineInfo(textAtStartOfLine);
          if (indentText) {
            dispatch(state.tr.insertText('\n' + indentText));
            return true;
          }
        }
      },
      Tab: (state: EditorState, dispatch) => {
        if (isCursorInsideCodeBlock(state)) {
          const { text: textAtStartOfLine } = getStartOfCurrentLine(state);
          const { indentToken } = getLineInfo(textAtStartOfLine);
          const indentToAdd = indentToken.token.repeat(
            indentToken.size - textAtStartOfLine.length % indentToken.size ||
              indentToken.size,
          );
          dispatch(state.tr.insertText(indentToAdd));
          return true;
        } else if (isSelectionEntirelyInsideCodeBlock(state)) {
          return true;
        }
        return false;
      },
      'Mod-]': (state: EditorState, dispatch) => {
        if (isSelectionEntirelyInsideCodeBlock(state)) {
          const { text, start } = getLinesFromSelection(state);
          const { tr } = state;
          forEachLine(text, (line, offset) => {
            const { indentText, indentToken } = getLineInfo(line);
            const indentToAdd = indentToken.token.repeat(
              indentToken.size - indentText.length % indentToken.size ||
                indentToken.size,
            );
            tr.insertText(indentToAdd, tr.mapping.map(start + offset));
          });
          dispatch(tr);
          return true;
        }
        return false;
      },
      'Mod-[': (state: EditorState, dispatch) => {
        if (isSelectionEntirelyInsideCodeBlock(state)) {
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
          return true;
        }
        return false;
      },
      'Mod-A': (state: EditorState, dispatch) => {
        if (isSelectionEntirelyInsideCodeBlock(state)) {
          const { $from, $to } = state.selection;
          const isFullCodeBlockSelection =
            $from.parentOffset === 0 &&
            $to.parentOffset === $to.parent.nodeSize - 2;
          if (!isFullCodeBlockSelection) {
            dispatch(
              state.tr.setSelection(
                new TextSelection(
                  state.doc.resolve($from.start()),
                  state.doc.resolve($to.end()),
                ),
              ),
            );
            return true;
          }
        }
        return false;
      },
    }),
  },
});
