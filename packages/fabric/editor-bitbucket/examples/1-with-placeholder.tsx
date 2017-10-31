// tslint:disable:no-console
import * as React from 'react';
import { default as Editor } from '../src';

const CANCEL_ACTION = () => console.log('Cancel');
const CHANGE_ACTION = () => console.log('Change');
const SAVE_ACTION = () => console.log('Save');

export default function Component() {
  return <Editor
    placeholder="What do you want to say?"
    onCancel={CANCEL_ACTION}
    onChange={CHANGE_ACTION}
    onSave={SAVE_ACTION}
  />;
}
