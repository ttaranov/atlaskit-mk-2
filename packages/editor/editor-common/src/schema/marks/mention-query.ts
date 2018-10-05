import { colors } from '@atlaskit/theme';
import { MarkSpec } from 'prosemirror-model';
import { SEARCH_QUERY } from '../groups';

export const mentionQuery: MarkSpec = {
  excludes: `${SEARCH_QUERY}`,
  inclusive: true,
  group: SEARCH_QUERY,
  parseDOM: [{ tag: 'span[data-mention-query]' }],
  toDOM(node) {
    return [
      'span',
      {
        'data-mention-query': 'true',
        'data-active': node.attrs.active,
        style: `color: ${colors.B400}`,
      },
    ];
  },
  attrs: {
    active: {
      default: true,
    },
  },
};
