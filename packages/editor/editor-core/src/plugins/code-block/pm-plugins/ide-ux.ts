import {
  Transaction,
  EditorState,
  TextSelection,
  Plugin,
} from 'prosemirror-state';
import { keydownHandler } from 'prosemirror-keymap';
import { completionRules } from '../ide-ux/data';
import {
  getEndOfCurrentLine,
  getLinesFromSelection,
  getStartOfCurrentLine,
  forEachLine,
  getLineInfo,
} from '../ide-ux/line-handling';
import { getCursor } from '../../../utils';

const isSelectionInsideCodeBlock = (state: EditorState): boolean =>
  state.selection.$from.sameParent(state.selection.$to) &&
  state.selection.$from.parent.type === state.schema.nodes.codeBlock;

const isCursorInsideCodeBlock = (state: EditorState): boolean =>
  !!getCursor(state.selection) && isSelectionInsideCodeBlock(state);

const addAutoCloseBracket = (
  from: number,
  to: number,
  leftBracket: string,
  rightBracket: string,
) => (state: EditorState, dispatch: (tr: Transaction) => void) => {
  const { tr } = state;
  dispatch(
    tr
      .replaceWith(from, to, state.schema.text(leftBracket + rightBracket))
      .setSelection(
        new TextSelection(
          tr.doc.resolve(tr.mapping.map(to) - rightBracket.length),
        ),
      ),
  );
  return true;
};

export default new Plugin({
  props: {
    handleTextInput(view, from, to, text) {
      const { state, dispatch } = view;
      if (isCursorInsideCodeBlock(state)) {
        const { language } = state.selection.$from.parent.attrs;
        const maybeClosingBracket = text;
        const openingBracket = completionRules.findOpeningBracket(
          maybeClosingBracket,
          language,
        );
        if (openingBracket) {
          if (getEndOfCurrentLine(state).text.startsWith(maybeClosingBracket)) {
            view.dispatch(
              state.tr.setSelection(
                new TextSelection(
                  state.doc.resolve(to + maybeClosingBracket.length),
                ),
              ),
            );
            return true;
          }
        }

        const maybeOpeningBracket = text;
        const closingBracket = completionRules.findClosingBracket(
          maybeOpeningBracket,
          language,
        );
        if (closingBracket) {
          return addAutoCloseBracket(
            from,
            to,
            maybeOpeningBracket,
            closingBracket,
          )(state, dispatch);
        }
      }
      return false;
    },
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
          dispatch(state.tr.insertText('  '));
          return true;
        }
        return false;
      },
      Backspace: (state: EditorState, dispatch) => {
        if (isCursorInsideCodeBlock(state)) {
          const $cursor = getCursor(state.selection)!;
          const { text: textAtStart } = getStartOfCurrentLine(state);
          if (textAtStart) {
            const maybeOpeningBracket = textAtStart[textAtStart.length - 1];
            const maybeClosingBracket = completionRules.findClosingBracket(
              maybeOpeningBracket,
              $cursor.parent.attrs.language,
            );
            const { text: textAtEnd } = getEndOfCurrentLine(state);
            if (
              maybeClosingBracket &&
              textAtEnd.startsWith(maybeClosingBracket)
            ) {
              dispatch(
                state.tr.delete(
                  $cursor.pos - 1,
                  $cursor.pos + maybeClosingBracket.length,
                ),
              );
              return true;
            }
          }
        }
        return false;
      },
      'Mod-]': (state: EditorState, dispatch) => {
        if (isSelectionInsideCodeBlock(state)) {
          const { text, start } = getLinesFromSelection(state);
          const { tr } = state;
          forEachLine(text, (line, offset) => {
            const { indentToken } = getLineInfo(line);
            tr.insertText(indentToken, tr.mapping.map(start + offset));
          });
          dispatch(tr);
          return true;
        }
        return false;
      },
      'Mod-[': (state: EditorState, dispatch) => {
        if (isSelectionInsideCodeBlock(state)) {
          const { text, start } = getLinesFromSelection(state);
          const { tr } = state;
          forEachLine(text, (line, offset) => {
            const { indentToken, indentLength } = getLineInfo(line);
            tr.delete(
              tr.mapping.map(start + offset),
              tr.mapping.map(
                start + offset + 1 + indentLength % indentToken.length,
              ),
            );
          });
          dispatch(tr);
          return true;
        }
        return false;
      },
      'Mod-a': (state: EditorState, dispatch) => {
        if (isSelectionInsideCodeBlock(state)) {
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
