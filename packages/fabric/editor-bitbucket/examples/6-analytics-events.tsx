// tslint:disable:no-console
import * as React from 'react';
import { default as Editor } from '../src';
import BitbucketStyles from '../example-helpers/bitbucketStyles';

const NOOP = () => {};

export default function Component() {
  return (
    <BitbucketStyles>
      <h5 style={{ marginBottom: 20 }}>
        Interact with the editor and observe analytics events in the Action
        Logger below
      </h5>
      <Editor
        placeholder="Click me to expand ..."
        analyticsHandler={console.log}
        onSave={NOOP}
        onCancel={NOOP}
      />
    </BitbucketStyles>
  );
}
