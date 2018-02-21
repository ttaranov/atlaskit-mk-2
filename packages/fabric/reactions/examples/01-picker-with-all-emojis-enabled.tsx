import * as React from 'react';
import { ReactionPicker } from '../src';
import { storyData } from '@atlaskit/emoji/dist/es5/support';
import debug, { enableLogger } from '../src/util/logger';
import { EmojiProvider } from '@atlaskit/emoji';

const { getEmojiResource } = storyData;

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
