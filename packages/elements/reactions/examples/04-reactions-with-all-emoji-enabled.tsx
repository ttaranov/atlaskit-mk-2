import { EmojiProvider } from '@atlaskit/emoji';
import { emoji } from '@atlaskit/util-data-test';
import * as React from 'react';
import { ConnectedReactionsView } from '../src';
import { ReactionsExampleWrapper } from './exemples-util';

const { getEmojiResource } = emoji.storyData;
const demoAri = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

export default function Example() {
  return (
    <ReactionsExampleWrapper>
      <div>
        <p>This is a message with some reactions</p>
        <ConnectedReactionsView
          containerAri={containerAri}
          ari={demoAri}
          emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          allowAllEmojis={true}
        />
      </div>
    </ReactionsExampleWrapper>
  );
}
