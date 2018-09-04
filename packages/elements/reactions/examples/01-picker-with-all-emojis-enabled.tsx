import * as React from 'react';
import { ReactionPicker } from '../src';
import { emoji } from '@atlaskit/util-data-test';
import debug, { enableLogger } from '../src/util/logger';
import { EmojiProvider } from '@atlaskit/emoji';
import { AnalyticsListener } from '@atlaskit/analytics-next';

const { getEmojiResource } = emoji.storyData;

export default function Example() {
  enableLogger(true);
  return (
    <AnalyticsListener channel="fabric-elements" onEvent={console.log}>
      <ReactionPicker
        emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
        onSelection={(emoji: any) => debug('reaction selected', emoji)}
        allowAllEmojis={true}
      />
    </AnalyticsListener>
  );
}
