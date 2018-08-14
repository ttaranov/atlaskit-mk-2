import { emoji } from '@atlaskit/util-data-test';
import * as React from 'react';
import { ReactionPicker } from '../src';

const { getEmojiResource } = emoji.storyData;

export default function Example() {
  return (
    <ReactionPicker
      emojiProvider={getEmojiResource()}
      allowAllEmojis={true}
    />
  );
}
