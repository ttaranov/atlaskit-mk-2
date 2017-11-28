// tslint:disable:no-console
import * as React from 'react';
import BitbucketStyles from '../example-helpers/bitbucketStyles';
import { MockMentionSource } from '../example-helpers/_mock-mentionsource';
import { EmojiProvider } from '@atlaskit/emoji';
import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
import {
  Converter,
  dropHandler,
  pasteHandler,
} from '@atlaskit/editor-test-helpers';
import { default as Editor } from '../src';

const mentionSource = new MockMentionSource();
const emojiProvider: Promise<
  EmojiProvider
> = emojiStoryData.getEmojiResource() as any;

const CANCEL_ACTION = () => console.log('Cancel');
const CHANGE_ACTION = () => console.log('Change');
const SAVE_ACTION = () => console.log('Save');
const NOOP = () => {};
const converter = new Converter(['jpg', 'jpeg', 'png', 'gif', 'svg'], 10000000);

const isClipboardEvent = (e: Event) => {
  return typeof ClipboardEvent !== 'undefined'
    ? e instanceof ClipboardEvent
    : (e as ClipboardEvent).clipboardData instanceof DataTransfer;
};

const isDragEvent = (e: Event) => {
  return typeof DragEvent !== 'undefined'
    ? e instanceof DragEvent
    : (e as DragEvent).dataTransfer instanceof DataTransfer;
};

const imageUploadHandler = (e: any, fn: any) => {
  if (isClipboardEvent(e)) {
    pasteHandler(converter, e, fn);
  } else if (isDragEvent(e)) {
    dropHandler(converter, e, fn);
  } else {
    // we cannot trigger a real file viewer from here
    // so we just simulate a succesful image upload and insert an image
    fn({
      src: 'https://design.atlassian.com/images/brand/logo-21.png',
    });
  }
};

type Props = {};
type State = { markdown?: string };
export default class EditorWithAllFeatures extends React.Component<
  Props,
  State
> {
  state: State = { markdown: '' };

  handleChange = (editor: Editor) => {
    this.setState(CHANGE_ACTION);
    this.setState({ markdown: editor.value });
  };

  render() {
    return (
      <BitbucketStyles>
        <div ref="root">
          <Editor
            placeholder="Test editor"
            onCancel={CANCEL_ACTION}
            onChange={this.handleChange}
            onSave={SAVE_ACTION}
            mentionSource={mentionSource}
            emojiProvider={emojiProvider}
            analyticsHandler={console.log}
            imageUploadHandler={imageUploadHandler}
          />
          <fieldset style={{ marginTop: 20 }}>
            <legend>Markdown</legend>
            <pre>{this.state.markdown}</pre>
          </fieldset>
        </div>
      </BitbucketStyles>
    );
  }
}
