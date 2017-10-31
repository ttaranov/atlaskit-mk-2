// tslint:disable:no-console
import * as React from 'react';
import InlineEdit from '@atlaskit/inline-edit';
import { default as Editor } from '../src';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';
import ExampleWrapper from '../example-helpers/ExampleWrapper';

export default function Component() {
  const fabricEditor = (
    <ExampleWrapper
      render={handleChange => (
        <Editor
          onChange={handleChange}
          mediaProvider={storyMediaProviderFactory()}
          isExpandedByDefault={true}
          allowLists={true}
          allowLinks={true}
          allowCodeBlock={true}
          allowAdvancedTextFormatting={true}
          allowSubSup={true}
          allowBlockQuote={true}
          defaultValue="Text"
        />
      )}
    />
  );

  return (
    <InlineEdit
      areActionButtonsHidden={true}
      label="@atlaskit/editor-jira + @atlaskit/inline-edit"
      onCancel={console.log.bind(console, 'onCancel')}
      onConfirm={console.log.bind(console, 'onConfirm')}
      editView={<div style={{ flexGrow: 1 }}>{fabricEditor}</div>}
      readView={<div>Click me!</div>}
    />
  );
}
