import { colors } from '@atlaskit/theme';
import { MarkSpec } from 'prosemirror-model';
import { SEARCH_QUERY } from '../groups';

export const typeAheadQuery: MarkSpec = {
  excludes: `${SEARCH_QUERY}`,
  inclusive: true,
  group: SEARCH_QUERY,
  parseDOM: [{ tag: 'span[data-type-ahead-query]' }],
  toDOM(node) {
    return [
      'span',
      {
        'data-type-ahead-query': 'true',
        'data-trigger': node.attrs.trigger,
        style: `color: ${colors.B400}`,
      },
    ];
  },
  attrs: {
    trigger: { default: '' },
  },
};
