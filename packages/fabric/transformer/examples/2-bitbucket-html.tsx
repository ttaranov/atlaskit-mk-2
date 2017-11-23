import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
import * as React from 'react';
import { PureComponent } from 'react';
import Editor from '@atlaskit/editor-bitbucket';
import { bitbucketSchema as schema } from '@atlaskit/editor-common';
import { EmojiProvider } from '@atlaskit/emoji';
import exampleHTML from '../example-helpers/exampleHTML';

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');
const emojiProvider = emojiStoryData.getEmojiResource() as Promise<
  EmojiProvider
>;

type Props = {};
type State = { hasError?: boolean };

export default class Example extends PureComponent<Props, State> {
  render() {
    return (
      <div
        ref="root"
        style={{ display: 'flex', alignItems: 'stretch', minHeight: '100%' }}
      >
        <div style={{ flex: 3, display: 'flex', alignItems: 'stretch' }}>
          {exampleHTML}
        </div>
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
      </div>
    );
  }
}
