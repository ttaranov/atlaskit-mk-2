import * as refractor from 'refractor/core.js';
import { Decoration } from 'prosemirror-view';

export const isCodeDecorationEqual = (left: Decoration, right: Decoration) =>
  left.from === right.from &&
  left.to === right.to &&
  (left as any).type.attrs.class === (right as any).type.attrs.class;

export const getDecorationsFor = (
  text: string,
  start: number,
): Decoration[] => {
  const tokens = refractor.tokenize(text, refractor.languages.javascript);
  let offset = start;
  return tokens.reduce((decorationList: Decoration[], token) => {
    if (typeof token !== 'string') {
      decorationList.push(
        Decoration.inline(offset, offset + token.length, {
          class: 'token ' + token.type,
        }),
      );
    }
    offset += token.length;
    return decorationList;
  }, []);
};
