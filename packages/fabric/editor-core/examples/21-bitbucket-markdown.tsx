import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
import { storyData as mentionStoryData } from '@atlaskit/mention/dist/es5/support';
import * as React from 'react';
import { PureComponent } from 'react';

import Editor from '../example-helpers/editor';
import schema from '../example-helpers/schema';
import { EmojiProvider } from '../src';
import { BitbucketTransformer } from '../src/transformers';
import exampleHTML from '../example-helpers/exampleHTML';

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');
const emojiProvider = emojiStoryData.getEmojiResource() as Promise<
  EmojiProvider
>;
const mentionProvider = Promise.resolve(mentionStoryData.resourceProvider);

type Props = {};
type State = { markdown?: string };

export default class Example extends PureComponent<Props, State> {
  state: State = { markdown: '' };
  serializer = new BitbucketTransformer(schema);

  handleChange = (editor: Editor) => {
    this.setState({ markdown: this.serializer.encode(editor.doc!) });
  };

  render() {
    return (
      <div ref="root">
        <Editor
          onCancel={CANCEL_ACTION}
          onChange={this.handleChange}
          onSave={SAVE_ACTION}
          mentionProvider={mentionProvider}
          emojiProvider={emojiProvider}
        />
        <fieldset style={{ marginTop: 20 }}>
          <legend>Markdown</legend>
          <pre>{this.state.markdown}</pre>
        </fieldset>
      </div>
    );
  }
}
