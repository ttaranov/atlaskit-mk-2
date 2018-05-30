import * as refractor from 'refractor/core.js';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { getEndOfLine, getStartOfLine } from './line-handling';

export const isCodeDecorationEqual = (left: Decoration, right: Decoration) =>
  left.from === right.from &&
  left.to === right.to &&
  (left as any).type.attrs.class === (right as any).type.attrs.class;

export const isCodeDecoration = (spec: { isCodeDecoration: boolean }) => {
  return !!(spec && spec.isCodeDecoration);
};

export const getDecorationsFor = (
  text: string,
  start: number,
  languageName?: string,
): Decoration[] => {
  const language = refractor.languages[languageName];
  if (language) {
    console.log(`Tokenising range: ${start} to ${start + text.length}`);
    performance.mark('refractor_start');
    const tokens = refractor.tokenize(text, language);
    performance.mark('refractor_end');
    performance.measure('refractor', 'refractor_start', 'refractor_end');
    let offset = start;
    return tokens.reduce((decorationList: Decoration[], token) => {
      if (typeof token !== 'string') {
        decorationList.push(
          Decoration.inline(
            offset,
            offset + token.length,
            {
              class: 'token ' + token.type,
            },
            { isCodeDecoration: true } as any,
          ),
        );
      }
      offset += token.length;
      return decorationList;
    }, []);
  }
  return [];
};

export const updateDecorationSetEfficiently = (
  set: DecorationSet,
  oldDecorations: Decoration[],
  newDecorations: Decoration[],
  doc: Node,
) => {
  // We remove any decorations that did exist, but don't any more
  const toRemove = oldDecorations.filter(
    oldDecoration =>
      !newDecorations.find(newDecoration =>
        isCodeDecorationEqual(oldDecoration, newDecoration),
      ),
  );
  // We add any decorations that now exist, but didn't before
  const toAdd = newDecorations.filter(
    newDecoration =>
      !oldDecorations.find(oldDecoration =>
        isCodeDecorationEqual(oldDecoration, newDecoration),
      ),
  );
  return set.remove(toRemove).add(doc, toAdd);
};

export const findCodeBlockChanges = (tr: Transaction) => {
  let positions = new Set();
  const { codeBlock } = tr.doc.type.schema.nodes;
  tr.steps.forEach(step => {
    step.getMap().forEach((oldStart, oldEnd, newStart, newEnd) => {
      if (oldStart !== newStart || oldEnd !== newEnd) {
        const $newStart = tr.doc.resolve(newStart);
        if (newEnd <= $newStart.end() && $newStart.parent.type === codeBlock) {
          positions.add(newStart);
        }
      }
    });
  });
  return Array.from(positions.values()).map(startOfChange => {
    const $startOfChange = tr.doc.resolve(startOfChange);
    const startOfLine = getStartOfLine($startOfChange).pos;
    const line = getEndOfLine(tr.doc.resolve(startOfLine));
    return {
      start: startOfLine,
      end: line.pos,
      text: line.text,
      language: $startOfChange.parent.attrs.language,
    };
  });
};
