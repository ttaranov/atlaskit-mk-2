import { emoji } from '@atlaskit/util-data-test';
import * as React from 'react';
import { ReactionPicker } from '../src';
import { ReactionsExampleWrapper } from './exemples-util';

const { getEmojiResource } = emoji.storyData;

export default function Example() {
  return (
    <ReactionsExampleWrapper>
      <ReactionPicker
        emojiProvider={getEmojiResource()}
        allowAllEmojis={true}
        onSelection={console.log}
      />
    </ReactionsExampleWrapper>
  );
}
