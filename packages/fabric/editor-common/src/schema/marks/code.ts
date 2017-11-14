import { MarkSpec } from 'prosemirror-model';
import { COLOR, FONT_STYLE, LINK, SEARCH_QUERY } from '../groups';

/**
 * @name code_mark
 */
export interface Definition {
  type: 'code';
}

export const code: MarkSpec = {
  excludes: `${FONT_STYLE} ${LINK} ${SEARCH_QUERY} ${COLOR}`,
  inclusive: true,
  parseDOM: [
    { tag: 'code', preserveWhitespace: true },
    { tag: 'tt', preserveWhitespace: true },
    {
      style: 'font-family',
      preserveWhitespace: true,
      getAttrs: (value: string) => (value.toLowerCase().indexOf('monospace') > -1) && null,
    },
    { style: 'white-space',
      preserveWhitespace: true,
      getAttrs: value => value === 'pre' && null
    },
  ],
  toDOM() {
    return ['span', {
      style: 'font-family: monospace; white-space: pre-wrap;',
      class: 'code'
    }];
  }
};
