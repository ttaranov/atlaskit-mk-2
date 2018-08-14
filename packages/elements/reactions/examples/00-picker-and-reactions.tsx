import { EmojiProvider } from '@atlaskit/emoji';
import { emoji } from '@atlaskit/util-data-test';
import * as React from 'react';
import { ConnectedReactionPicker, ConnectedReactionsView, ReactionProvider } from '../src';
import { MockReactionsAdapter } from '../src/adapter';

const { getEmojiResource } = emoji.storyData;
const demoAri = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

const adapter = new MockReactionsAdapter(500);

export default function Example() {
  return (
    <ReactionProvider adapter={adapter}>
      <div>
        <div style={{ display: 'flex' }}>
          <p>Lorem ipsum dolor sit amet...</p>
          <ConnectedReactionPicker
            containerAri={containerAri}
            ari={demoAri}
            emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          />
        </div>
        <hr />
        <ConnectedReactionsView
          containerAri={containerAri}
          ari={demoAri}
          emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
        />
      </div>
    </ReactionProvider>
  );
}
