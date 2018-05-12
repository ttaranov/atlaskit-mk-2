import * as refractor from 'refractor/core.js';
import { Decoration } from 'prosemirror-view';

export default (text: string, start: number): Decoration[] => {
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
