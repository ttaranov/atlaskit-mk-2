// tslint:disable:no-console
import * as React from 'react';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';
import { default as Editor } from '../src';
import ExampleWrapper from '../example-helpers/ExampleWrapper';

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');

export default function Component() {
  return (
    <ExampleWrapper
      render={handleChange => (
        <div>
          <div style={{ padding: '5px 0' }}>
            ️️️⚠️ Atlassians, make sure you're logged into{' '}
            <a href="https://id.stg.internal.atlassian.com" target="_blank">
              staging Identity server
            </a>.
          </div>
          <Editor
            onChange={handleChange}
            mediaProvider={storyMediaProviderFactory()}
            onCancel={CANCEL_ACTION}
            onSave={SAVE_ACTION}
          />
        </div>
      )}
    />
  );
}
