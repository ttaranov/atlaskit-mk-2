import * as React from 'react';
import { emoji } from '@atlaskit/util-data-test';
import { EmojiProvider } from '@atlaskit/emoji';
import { ReactionsResource } from '../src/reactions-resource';
import { ResourcedReactions } from '../src';

const { getEmojiResource } = emoji.storyData;
const demoAri = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

function getReactionConfig() {
  let reactionConfig;
  try {
    // tslint:disable-next-line import/no-unresolved, no-var-requires
    reactionConfig = require('../local-config')['default'];
  } catch (e) {
    // tslint:disable-next-line import/no-unresolved, no-var-requires
    reactionConfig = require('../local-config-example')['default'];
  }

  return reactionConfig;
}

export default function Example() {
  return (
    <div>
      <p>This is a message with some reactions</p>
      <ResourcedReactions
        containerAri={containerAri}
        ari={demoAri}
        objectCreationTimestamp={Date.now()}
        emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
        reactionsProvider={Promise.resolve(
          new ReactionsResource(getReactionConfig()),
        )}
        allowAllEmojis={true}
      />
    </div>
  );
}
