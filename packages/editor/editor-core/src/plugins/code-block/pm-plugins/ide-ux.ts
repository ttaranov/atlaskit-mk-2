import {
  EditorState,
  TextSelection,
  Plugin,
  Transaction,
  PluginKey,
} from 'prosemirror-state';
import { keydownHandler } from 'prosemirror-keymap';
import {
  getLinesFromSelection,
  getStartOfCurrentLine,
  forEachLine,
  getLineInfo,
  getStartOfLine,
} from '../ide-ux/line-handling';
import { getCursor } from '../../../utils';
import {
  getDecorationsFor,
  isCodeDecorationEqual,
  updateDecorationSetEfficiently,
  findCodeBlockChanges,
  isCodeDecoration,
  getDecorationsForPM,
} from '../ide-ux/syntax-highlighting';
import { findChildrenByType } from 'prosemirror-utils';
import { DecorationSet, Decoration } from 'prosemirror-view';

const isSelectionEntirelyInsideCodeBlock = (state: EditorState): boolean =>
  state.selection.$from.sameParent(state.selection.$to) &&
  state.selection.$from.parent.type === state.schema.nodes.codeBlock;

const isCursorInsideCodeBlock = (state: EditorState): boolean =>
  !!getCursor(state.selection) && isSelectionEntirelyInsideCodeBlock(state);

export const pluginKey = new PluginKey('codeBlockIDEUX');
export default new Plugin({
  key: pluginKey,
  state: {
    init(_, state) {
      return findChildrenByType(state.doc, state.schema.nodes.codeBlock)
        .map(({ pos, node }) => {
          const text = node.textContent;
          return getDecorationsForPM(text, pos + 1);
        })
        .reduce((prev: DecorationSet, curr: Decoration[]) => {
          return curr ? prev.add(state.doc, curr) : prev;
        }, DecorationSet.empty);
    },
    apply(tr: Transaction, set: DecorationSet, oldState: EditorState) {
      if (!tr.docChanged && !tr.getMeta(pluginKey)) {
        return set;
      }
      let decorations = set.map(tr.mapping, tr.doc);

      // Find all positions inside code-blocks that have changed
      const changes = findCodeBlockChanges(tr);

      changes.forEach(({ start, end }, i) => {
        const $end = tr.doc.resolve(start).end();

        // const decorationsPast = decorations.find($start, $end, isCodeDecoration);
        const textBetween = tr.doc.textBetween(start, $end);
        const decoration = decorations.find(start, end, isCodeDecoration)[0];

        // const decorationsFuture = getDecorationsForPM(textBetween, $start);
        // decorations = updateDecorationSetEfficiently(
        //   decorations,
        //   decorationsPast,
        //   decorationsFuture,
        //   tr.doc
        // );
        if (decoration && decoration.spec.start) {
          decorations = DecorationSet.create(
            tr.doc,
            getDecorationsForPM(textBetween, start, decoration.spec.state),
          );
        } else {
          decorations = DecorationSet.create(
            tr.doc,
            getDecorationsForPM(textBetween, start),
          );
        }
      });
      return decorations;
    },
  },
  props: {
    decorations: state => {
      return pluginKey.getState(state);
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
