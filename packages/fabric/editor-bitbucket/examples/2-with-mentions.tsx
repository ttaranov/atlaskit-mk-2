// tslint:disable:no-console
import * as React from 'react';
import { MockMentionSource } from '../example-helpers/_mock-mentionsource';
import { default as Editor } from '../src';

const CANCEL_ACTION = () => console.log('Cancel');
const CHANGE_ACTION = () => console.log('Change');
const SAVE_ACTION = () => console.log('Save');

const mentionSource = new MockMentionSource();

export default function Component() {
  return <Editor
    mentionSource={mentionSource}
    onCancel={CANCEL_ACTION}
    onChange={CHANGE_ACTION}
    onSave={SAVE_ACTION}
  />;
}
