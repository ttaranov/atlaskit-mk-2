import * as React from 'react';
import { storyData } from '@atlaskit/emoji/dist/es5/support';
import { reactionsProviderPromise } from '../src/mock-reactions-provider';
import { EmojiProvider } from '@atlaskit/emoji';
import { ReactionsProvider } from '../src/reactions-resource';
import { ResourcedReactions } from '../src';

const { getEmojiResource } = storyData;
const demoAri = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

export default function Example() {
  return (
    <div>
      <p>This is a message with some reactions</p>
      <ResourcedReactions
        containerAri={containerAri}
        ari={demoAri}
        emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
        reactionsProvider={
          reactionsProviderPromise as Promise<ReactionsProvider>
        }
        allowAllEmojis={true}
      />
    </div>
  );
}
