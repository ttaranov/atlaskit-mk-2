import { EmojiProvider } from '@atlaskit/emoji';
import { emoji } from '@atlaskit/util-data-test';
import * as React from 'react';
import {
  ConnectedReactionsView,
  MockReactionsAdapter,
  ReactionProvider,
} from '../src';

const { getEmojiResource } = emoji.storyData;
const demoAri = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

const adapter = new MockReactionsAdapter(500);

export default function Example() {
  return (
    <ReactionProvider adapter={adapter}>
      <div
        style={{
          width: '300px',
          border: '1px solid #777',
        }}
      >
        <p>This is a message with some reactions</p>
        <ConnectedReactionsView
          containerAri={containerAri}
          ari={demoAri}
          emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          allowAllEmojis={true}
        />
      </div>
    </ReactionProvider>
  );
}
