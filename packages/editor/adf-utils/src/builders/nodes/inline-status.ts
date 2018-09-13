import { InlineStatusDefinition } from '@atlaskit/editor-common';

export const inlineStatus = (
  attrs: InlineStatusDefinition['attrs'] = {
    color: 'blue',
  },
): InlineStatusDefinition => ({
  type: 'inlineStatus',
  content: [new Text('DEFAULT')],
  attrs,
});
