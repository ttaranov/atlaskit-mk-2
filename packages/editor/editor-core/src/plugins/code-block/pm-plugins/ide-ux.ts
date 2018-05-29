import {
  EditorState,
  TextSelection,
  Plugin,
  Transaction,
} from 'prosemirror-state';
import { keydownHandler } from 'prosemirror-keymap';
import {
  getLinesFromSelection,
  getStartOfCurrentLine,
  forEachLine,
  getLineInfo,
} from '../ide-ux/line-handling';
import { getCursor } from '../../../utils';
import {
  getDecorationsFor,
  isCodeDecorationEqual,
} from '../ide-ux/syntax-highlighting';
import { findChildrenByType } from 'prosemirror-utils';
import { DecorationSet, Decoration } from 'prosemirror-view';

const isSelectionEntirelyInsideCodeBlock = (state: EditorState): boolean =>
  state.selection.$from.sameParent(state.selection.$to) &&
  state.selection.$from.parent.type === state.schema.nodes.codeBlock;

const isCursorInsideCodeBlock = (state: EditorState): boolean =>
  !!getCursor(state.selection) && isSelectionEntirelyInsideCodeBlock(state);

export default new Plugin({
  state: {
    init(_, state) {
      return findChildrenByType(state.doc, state.schema.nodes.codeBlock)
        .map(({ pos, node }) => {
          const text = node.textContent;
          return getDecorationsFor(text, pos + 1);
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
      let { codeBlock } = tr.doc.type.schema.nodes;

      // Find all positions inside code-blocks that have changed
      let positions = new Set();
      tr.steps.forEach(step => {
        step.getMap().forEach((oldStart, oldEnd, newStart, newEnd) => {
          if (oldStart !== newStart || oldEnd !== newEnd) {
            const $newStart = tr.doc.resolve(newStart);
            if (
              newEnd <= $newStart.end() &&
              $newStart.parent.type === codeBlock
            ) {
              positions.add(newStart);
            }
          }
        });
      });

      // For each position, recalculate the decorations until the end
      positions.forEach(start => {
        const end = tr.doc.resolve(start).end();
        const existing = decorations.find(start, end);
        const updated = getDecorationsFor(
          tr.doc.textBetween(start, end),
          start,
        );
        const remove = existing.filter(
          e => !updated.find(u => isCodeDecorationEqual(e, u)),
        );
        const add = updated.filter(
          u => !existing.find(e => isCodeDecorationEqual(e, u)),
        );
        decorations = decorations.remove(remove).add(tr.doc, add);
      });
      return decorations;
    },
  },
  props: {
    decorations: state => {
      return plu;
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
