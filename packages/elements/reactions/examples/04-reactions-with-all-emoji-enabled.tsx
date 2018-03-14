import * as React from 'react';
import { reactionsProvider } from '../src/mock-reactions-provider';
import { Reactions } from '../src';
import { storyData } from '@atlaskit/emoji/dist/es5/support';
import { EmojiProvider } from '@atlaskit/emoji';
import { ReactionsProvider } from '../src/reactions-resource';
import debug, { enableLogger } from '../src/util/logger';

const { getEmojiResource } = storyData;
const demoAri = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

export default function Example() {
  enableLogger(true);
  return (
    <div>
      <p>This is a message with some reactions</p>
      <Reactions
        containerAri={containerAri}
        ari={demoAri}
        emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
        reactionsProvider={reactionsProvider as ReactionsProvider}
        onReactionClick={(emojiId: string): any => {
          debug('onReactionClick: ', emojiId);
        }}
        allowAllEmojis={true}
      />
    </div>
  );
}
