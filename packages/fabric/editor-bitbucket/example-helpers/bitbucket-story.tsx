import '!style!css!less!./bitbucket-styles.less';
import { base64fileconverter, storyDecorator } from '@atlaskit/editor-core/dist/es5/test-helper';
import { action, storiesOf } from '@kadira/storybook';
import * as React from 'react';
import { PureComponent } from 'react';
import { EmojiProvider } from '@atlaskit/editor-core';
import { storyData as emojiStoryData } from '@atlaskit/emoji/src/support';
import { MockMentionSource } from './_mock-mentionsource';

import { default as Editor, version as editorVersion } from '../src';

import { name } from '../package.json';

const CANCEL_ACTION = () => action('Cancel')();
const CHANGE_ACTION = () => action('Change')();
const SAVE_ACTION = () => action('Save')();
const NOOP = () => {};
const { Converter, dropHandler, pasteHandler } = base64fileconverter;
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

const analyticsHandler = (actionName, props) => action(actionName)(props);

storiesOf(name, module)
  .addDecorator(storyDecorator(editorVersion))
  .add('All bitbucket features enabled', () => {
    type Props = {};
    type State = { markdown?: string };
    class EditorWithAllFeatures extends PureComponent<Props, State> {
      state: State = { markdown: '' };

      handleChange = (editor: Editor) => {
        this.setState(CHANGE_ACTION);
        this.setState({ markdown: editor.value });
      };

      render() {
        return (
          <div ref="root">
            <Editor
              placeholder="Test editor"
              onCancel={CANCEL_ACTION}
              onChange={this.handleChange}
              onSave={SAVE_ACTION}
              mentionSource={mentionSource}
              emojiProvider={emojiProvider}
              analyticsHandler={analyticsHandler}
              imageUploadHandler={imageUploadHandler}
            />
            <fieldset style={{ marginTop: 20 }}>
              <legend>Markdown</legend>
              <pre>{this.state.markdown}</pre>
            </fieldset>
          </div>
        );
      }
    }

    return <EditorWithAllFeatures />;
  });
