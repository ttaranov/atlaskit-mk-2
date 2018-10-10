import { colors } from '@atlaskit/theme';
import { MarkSpec } from 'prosemirror-model';
import { SEARCH_QUERY } from '../groups';

export const emojiQuery: MarkSpec = {
  inclusive: true,
  group: SEARCH_QUERY,
  parseDOM: [{ tag: 'span[data-emoji-query]' }],
  toDOM() {
    return [
      'span',
      {
        'data-emoji-query': 'true',
        style: `color: ${colors.B400}`,
      },
    ];
  },
};
