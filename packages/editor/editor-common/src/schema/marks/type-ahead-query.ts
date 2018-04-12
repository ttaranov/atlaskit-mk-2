import { akColorB400 } from '@atlaskit/util-shared-styles';
import { MarkSpec } from 'prosemirror-model';
import { SEARCH_QUERY } from '../groups';

export const typeAheadQuery: MarkSpec = {
  excludes: `${SEARCH_QUERY}`,
  inclusive: true,
  group: SEARCH_QUERY,
  parseDOM: [{ tag: 'span[data-type-ahead-query]' }],
  toDOM(node): [string, any] {
    return [
      'span',
      {
        'data-type-ahead-query': true,
        'data-trigger': node.attrs.trigger,
        style: `color: ${akColorB400}`,
      },
    ];
  },
  attrs: {
    trigger: { default: '' },
  },
};
