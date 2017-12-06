import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
import * as React from 'react';
import Editor from '@atlaskit/editor-bitbucket';
import { EmojiProvider } from '@atlaskit/emoji';
import exampleHTML from '../example-helpers/exampleHTML';

const emojiProvider = emojiStoryData.getEmojiResource() as Promise<
  EmojiProvider
>;

export default function Example() {
  return (
    <div ref="root">
      <div
        style={{
          flex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          alignContent: 'stretch',
        }}
      >
        <Editor
          isExpandedByDefault={true}
          emojiProvider={emojiProvider}
          defaultValue={exampleHTML}
        />
      </div>
      <div style={{ marginTop: '20px' }}>{exampleHTML}</div>
    </div>
  );
}
