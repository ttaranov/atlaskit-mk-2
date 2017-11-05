// tslint:disable:no-console

import * as React from 'react';
import Editor from '../src';
import ExampleWrapper from '../example-helpers/ExampleWrapper';
import { resourceProvider } from '../example-helpers/mentions/story-data';

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');

const mentionProvider = new Promise<any>(resolve => {
  resolve(resourceProvider);
});

export default function Component() {
  return (
    <ExampleWrapper
      render={handleChange => (
        <Editor
          isExpandedByDefault={true}
          onCancel={CANCEL_ACTION}
          onSave={SAVE_ACTION}
          onChange={handleChange}
          mentionProvider={mentionProvider}
          analyticsHandler={console.log.bind(console, 'Analytics event')}
        />
      )}
    />
  );
}
