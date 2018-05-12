import {
  Transaction,
  EditorState,
  TextSelection,
  Plugin,
  Selection,
} from 'prosemirror-state';
import { CodeBlockView } from '../nodeviews/code-block';
import { completionRules } from '../ide-ux/data';
import { keydownHandler } from 'prosemirror-keymap';
import { DecorationSet, Decoration } from 'prosemirror-view';
import tokenize from '../ide-ux/highlighting';
import tokenizeTest from '../ide-ux/prism';
import { findChildrenByType } from 'prosemirror-utils';

const getStartOfCurrentLine = (state: EditorState) => {
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
const getEndOfCurrentLine = (state: EditorState) => {
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

function getLinesFromSelection(state: EditorState) {
  const { pos: start } = getStartOfCurrentLine(state);
  const { pos: end } = getEndOfCurrentLine(state);
  const text = state.doc.textBetween(start, end);
  return { text, start, end };
}

function getCursor(selection: Selection) {
  return (selection as TextSelection).$cursor || undefined;
}

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

const forEachLine = (
  code: string,
  callback: (line: string, offset: number) => void,
) => {
  let offset = 0;
  code.split('\n').forEach(line => {
    callback(line, offset);
    offset += line.length + 1;
  });
};

const isCursorSelection = (state: EditorState): boolean =>
  !!(state.selection as TextSelection).$cursor;

const isSelectionInsideCodeBlock = (state: EditorState): boolean =>
  state.selection.$from.sameParent(state.selection.$to) &&
  state.selection.$from.parent.type === state.schema.nodes.codeBlock;

const isCursorInsideCodeBlock = (state: EditorState): boolean =>
  isCursorSelection(state) && isSelectionInsideCodeBlock(state);

const TAB_REGEX = /(?=\t+)[^\t]/;
const SPACES_REGEX = /(?=(  )+)[^ ]/;
const getLineInfo = (line: string) => {
  const indentToken = line.startsWith('\t') ? '\t' : '  ';
  const indentLength = line.search(
    indentToken === '\t' ? TAB_REGEX : SPACES_REGEX,
  );
  const indentText = line.substring(0, indentLength);
  return { indentToken, indentLength, indentText };
};

const ideUX: Plugin = new Plugin({
  state: {
    init(_, state) {
      return findChildrenByType(state.doc, state.schema.nodes.codeBlock)
        .map(({ pos, node }) => {
          const text = node.textContent;
          const start = pos + 1;
          return tokenizeTest(text, start);
        })
        .reduce((prev: DecorationSet, curr: Decoration[]) => {
          return curr ? prev.add(state.doc, curr) : prev;
        }, DecorationSet.empty);
    },
    apply(tr: Transaction, set: DecorationSet, oldState: EditorState) {
      if (!tr.docChanged) {
        return set;
      }
      let decorations = set.map(tr.mapping, tr.doc);
      const changedLinesStartPos = new Set();
      tr.steps.forEach(step =>
        step.getMap().forEach((oldStart, oldEnd, newStart, newEnd) => {
          if (oldStart === newStart && oldEnd === newEnd) return;
          const start = tr.doc.resolve(newStart);
          const end = tr.doc.resolve(newEnd);
          if (
            start.parent.type === tr.doc.type.schema.nodes.codeBlock ||
            end.parent.type === tr.doc.type.schema.nodes.codeBlock
          ) {
            changedLinesStartPos.add(start.start());
          }
        }),
      );
      changedLinesStartPos.forEach(pos => {
        const end = tr.doc.resolve(pos).end();
        const toBeRemoved = decorations.find(pos, end);
        const toBeAdded = tokenizeTest(tr.doc.textBetween(pos, end), pos);
        const toBeRemoveOptim = toBeRemoved.filter(
          remove =>
            !toBeAdded.find(
              add =>
                remove.from === add.from &&
                remove.to === add.to &&
                (remove as any).type.attrs.class ===
                  (add as any).type.attrs.class,
            ),
        );
        const toBeAddedOptim = toBeAdded.filter(
          add =>
            !toBeRemoved.find(
              remove =>
                add.from === remove.from &&
                add.to === remove.to &&
                (add as any).type.attrs.class ===
                  (remove as any).type.attrs.class,
            ),
        );
        decorations = decorations
          .remove(toBeRemoveOptim)
          .add(tr.doc, toBeAddedOptim);
      });
      return decorations;
    },
  },
  props: {
    decorations: state => {
      return ideUX.getState(state);
    },
    nodeViews: {
      codeBlock: (node, view, getPos) => new CodeBlockView(node, view, getPos),
    },
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
          if (
            $from.parentOffset === 0 &&
            $to.parentOffset === $to.parent.nodeSize - 2
          ) {
            return false; // allow Mod-a-ing twice, to select whole document
          } else {
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

export default ideUX;
