// tslint:disable:no-console
import * as React from 'react';
import { default as Editor } from '../src';
import BitbucketStyles from '../example-helpers/bitbucketStyles';

const CANCEL_ACTION = () => console.log('Cancel');
const CHANGE_ACTION = () => console.log('Change');
const SAVE_ACTION = () => console.log('Save');

export default function Component() {
  return (
    <BitbucketStyles>
      <Editor
        onCancel={CANCEL_ACTION}
        onChange={CHANGE_ACTION}
        onSave={SAVE_ACTION}
      />
    </BitbucketStyles>
  );
}
