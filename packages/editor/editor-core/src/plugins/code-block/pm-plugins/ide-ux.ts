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
          return getDecorationsFor(text, pos + 1, node.attrs.language);
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

      changes.forEach(({ start, end, text, language }, i) => {
        // // is catastrophic change means
        // // when I retokenise the affect lines & the next three tokens
        // // the next three tokens change as a result of the changes we've made

        // const disturbedStart = getPosOfFirstDecorationAffected();
        // const disturbedEnd = getPosOfLastDecorationAffectedPlusNextThreeTokens();
        // const lastThreeTokens = decorations.find(end, disturbedEnd, isCodeDecoration);
        // if (checkIfLastThreeTokensAreSame(lastThreeTokens, otherThings)) {
        //   // if so, then we can just replace the syntax from disturbedStart to the end and we should be :thumbsup:
        // } else {

        // }

        const invalidated = decorations.find(start, end, isCodeDecoration);
        if (!invalidated.length) {
          const $pos = tr.doc.resolve(start);
          const invalidated = decorations.find(
            $pos.start(),
            $pos.end(),
            isCodeDecoration,
          );
          const replacement = getDecorationsFor(
            tr.doc.textBetween($pos.start(), $pos.end()),
            start,
            language,
          );
          decorations = updateDecorationSetEfficiently(
            decorations,
            invalidated,
            replacement,
            tr.doc,
          );
          return;
        }
        const invalidatedStart = invalidated[0].from;
        const invalidatedEnd = invalidated[invalidated.length - 1].to;
        const extraTokens = decorations.find(
          invalidatedEnd,
          invalidatedEnd + 20,
          isCodeDecoration,
        );

        let isCatastrophic = false;
        if (extraTokens.length) {
          const endOfTokens = extraTokens[extraTokens.length - 1].to;
          const replacement = getDecorationsFor(
            tr.doc.textBetween(invalidatedStart, endOfTokens),
            invalidatedStart,
            language,
          );

          for (let i = extraTokens.length, j = 0; i > 0; i--, j++) {
            if (
              !isCodeDecorationEqual(
                extraTokens[j],
                replacement[replacement.length - i],
              )
            ) {
              isCatastrophic = true;
              break;
            }
          }
        }

        if (isCatastrophic) {
          const numberOfExtra = Math.min(3, extraTokens.length);
          const endOfTokens = extraTokens[numberOfExtra - 1].to;
          const codeBlockEnd = tr.doc.resolve(endOfTokens).end();
          const replacement = getDecorationsFor(
            tr.doc.textBetween(invalidatedStart, codeBlockEnd),
            invalidatedStart,
            language,
          );
          const toBeReplaced = decorations.find(
            invalidatedStart,
            codeBlockEnd,
            isCodeDecoration,
          );
          decorations = updateDecorationSetEfficiently(
            decorations,
            toBeReplaced,
            replacement,
            tr.doc,
          );
        } else {
          const toBeReplaced = decorations.find(
            invalidatedStart,
            invalidatedEnd,
            isCodeDecoration,
          );
          const replacement = getDecorationsFor(
            tr.doc.textBetween(invalidatedStart, invalidatedEnd),
            invalidatedStart,
            language,
          );
          decorations = updateDecorationSetEfficiently(
            decorations,
            toBeReplaced,
            replacement,
            tr.doc,
          );
        }
      });

      //   const codeBlockDecorations = decorations.find(start, end, isCodeDecoration);
      //   const startToRecalculate = codeBlockDecorations.length ? getStartOfLine(tr.doc.resolve(codeBlockDecorations[0].from)).pos : start;
      //   const codeBlock = tr.doc.resolve(start);

      //   const decorationsPast = decorations.find(startToRecalculate, codeBlock.end(), isCodeDecoration);

      //   const textBetween = tr.doc.textBetween(startToRecalculate, codeBlock.end());

      //   performance.mark("getDecorationsFor_start");
      //   const decorationsFuture = getDecorationsFor(textBetween, startToRecalculate, language);
      //   performance.mark("getDecorationsFor_end");
      //   performance.measure("getDecorationsFor", "getDecorationsFor_start", "getDecorationsFor_end");
      //   performance.mark("updateDecorationSetEfficiently_start");
      //   decorations = updateDecorationSetEfficiently(
      //     decorations,
      //     decorationsPast,
      //     decorationsFuture,
      //     tr.doc
      //   );
      //   performance.mark("updateDecorationSetEfficiently_end");
      //   performance.measure("updateDecorationSetEfficiently", "updateDecorationSetEfficiently_start", "updateDecorationSetEfficiently_end");
      // });
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
