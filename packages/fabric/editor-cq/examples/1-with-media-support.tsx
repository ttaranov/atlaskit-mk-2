// tslint:disable:no-console

import * as React from 'react';
import * as mediaTestHelpers from '@atlaskit/media-test-helpers';
import Editor from '../src';
import ExampleWrapper from '../example-helpers/ExampleWrapper';
import { resourceProvider } from '../example-helpers/mentions/story-data';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');

const mentionProvider = new Promise<any>(resolve => {
  resolve(resourceProvider);
});

export default function Component() {
  return (
    <ExampleWrapper
      render={handleChange => (
        //  TODO: remove the following note and link after the login is not required anymore or there's better way to run the story.
        <div>
          <div style={{ padding: '5px 0' }}>
            ️️️⚠️ Atlassians, make sure you're logged into{' '}
            <a href="https://id.stg.internal.atlassian.com" target="_blank">
              staging Identity server
            </a>.
          </div>
          <Editor
            isExpandedByDefault={true}
            mentionProvider={mentionProvider}
            mediaProvider={storyMediaProviderFactory(mediaTestHelpers as any)}
            onCancel={CANCEL_ACTION}
            onSave={SAVE_ACTION}
            onChange={handleChange}
            analyticsHandler={console.log.bind(console, 'Analytics event')}
          />
        </div>
      )}
    />
  );
}
