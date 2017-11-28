// tslint:disable:no-console
import * as React from 'react';
import { EmojiProvider } from '@atlaskit/emoji';
import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
import { default as Editor } from '../src';
import BitbucketStyles from '../example-helpers/bitbucketStyles';

const CANCEL_ACTION = () => console.log('Cancel');
const CHANGE_ACTION = () => console.log('Change');
const SAVE_ACTION = () => console.log('Save');

const emojiProvider: Promise<
  EmojiProvider
> = emojiStoryData.getEmojiResource() as any;

export default function Component() {
  return (
    <BitbucketStyles>
      <Editor
        emojiProvider={emojiProvider}
        onCancel={CANCEL_ACTION}
        onChange={CHANGE_ACTION}
        onSave={SAVE_ACTION}
      />
    </BitbucketStyles>
  );
}
