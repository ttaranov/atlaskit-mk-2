import * as React from 'react';
import { ReactionPicker } from '../src';
import { emoji } from '@atlaskit/util-data-test';
import debug, { enableLogger } from '../src/util/logger';
import { EmojiProvider } from '@atlaskit/emoji';

const { getEmojiResource } = emoji.storyData;

export default function Example() {
  enableLogger(true);
  return (
    <ReactionPicker
      emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
      onSelection={(emoji: any) => debug('reaction selected', emoji)}
      allowAllEmojis={true}
    />
  );
}
