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
const emojiProvider = emojiStoryData.getEmojiResource() as Promise<EmojiProvider>;
const mentionProvider = Promise.resolve(mentionStoryData.resourceProvider);

type Props = {};
type State = { hasError?: boolean };

export default class Example extends PureComponent<Props, State> {
  state: State = { hasError: false };
  textarea?: HTMLTextAreaElement;
  editor?: Editor;
  serializer = new BitbucketTransformer(schema);

  setEditorContentFromHtml = () => {
    const { textarea, editor } = this;

    if (!textarea || !editor) {
      return;
    }

    this.setState({ hasError: false });

    try {
      const node = this.serializer.parse(textarea.value);
      this.editor!.doc = node;
    } catch (e) {
      this.setState({ hasError: true });
      console.error('Error when setting from HTML', e);
    }
  }

  handleTextareaRef = (ref: HTMLTextAreaElement | null) => {
    if (!ref) {
      this.textarea = undefined;
      return;
    }
    this.textarea = ref;
    ref.value = exampleHTML;
    this.setEditorContentFromHtml();
  }

  handleEditorRef = (ref: Editor | null) => {
    if (!ref) {
      this.editor = undefined;
      return;
    }

    this.editor = ref;

    // TODO: we don't currently have a good method of knowing that the editor can receive content
    setTimeout(() => {
      this.setEditorContentFromHtml();
    }, 500);
  }

  render() {
    return (
      <div ref="root" style={{ display: 'flex', alignItems: 'stretch', minHeight: '100%' }}>
        <div style={{ flex: 3, display: 'flex', alignItems: 'stretch' }}>
          <textarea
            style={{
              flex: 1,
              fontFamily: 'monospace',
              fontSize: '90%',
              outline: 'none',
              border: '0 none',
              padding: '5px 10px',
              borderRight: '10px solid rgb(247, 247, 247)',
              background: this.state.hasError ? 'red' : 'white'
            }}
            ref={this.handleTextareaRef}
            onKeyUp={this.setEditorContentFromHtml}
          />
        </div>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'stretch', alignContent: 'stretch' }}>
          <Editor
            ref={this.handleEditorRef}
            isExpandedByDefault={true}
            emojiProvider={emojiProvider}
          />
        </div>
      </div>
    );
  }
}
