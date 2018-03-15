import * as React from 'react';
import { ReactionPicker, Reactions } from '../src';
import { reactionsProvider } from '../src/mock-reactions-provider';
import { storyData } from '@atlaskit/emoji/dist/es5/support';
import { EmojiProvider } from '@atlaskit/emoji';
import { ReactionsProvider } from '../src/reactions-resource';

const { getEmojiResource } = storyData;
const demoAri = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

export default function Example() {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <p>Lorem ipsum dolor sit amet...</p>
        <ReactionPicker
          emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          // tslint:disable-next-line:jsx-no-lambda
          onSelection={emojiId =>
            reactionsProvider.toggleReaction(containerAri, demoAri, emojiId)
          }
        />
      </div>
      <hr />
      <Reactions
        containerAri={containerAri}
        ari={demoAri}
        emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
        reactionsProvider={reactionsProvider as ReactionsProvider}
        // tslint:disable-next-line:jsx-no-lambda
        onReactionClick={emojiId =>
          reactionsProvider.toggleReaction(containerAri, demoAri, emojiId)
        }
      />
    </div>
  );
}
