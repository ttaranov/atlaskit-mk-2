// tslint:disable:no-console
import * as React from 'react';
import { default as Editor } from '../src';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';
import ExampleWrapper from '../example-helpers/ExampleWrapper';
import MentionResource from '../example-helpers/mentions/mention-resource';

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');

const mentionEncoder = (userId: string) => `/secure/ViewProfile?name=${userId}`;

export default function Component() {
  return (
    <ExampleWrapper
      render={handleChange => (
        <Editor
          onChange={handleChange}
          onCancel={CANCEL_ACTION}
          onSave={SAVE_ACTION}
          allowLists={true}
          allowLinks={true}
          allowCodeBlock={true}
          allowTables={true}
          allowAdvancedTextFormatting={true}
          allowSubSup={true}
          allowTextColor={true}
          allowBlockQuote={true}
          analyticsHandler={console.log}
          mediaProvider={storyMediaProviderFactory()}
          mentionProvider={Promise.resolve(new MentionResource())}
          mentionEncoder={mentionEncoder}
          // tslint:disable-next-line:jsx-no-lambda
          renderFooter={({ saveDisabled }) => (
            <div style={{ textAlign: 'right' }}>Some extra footer content</div>
          )}
        />
      )}
    />
  );
}
