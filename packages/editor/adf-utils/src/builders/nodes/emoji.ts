import { EmojiDefinition, EmojiAttributes } from '@atlaskit/editor-common';

export const emoji = (attrs: EmojiAttributes): EmojiDefinition => ({
  type: 'emoji',
  attrs,
});
