// tslint:disable:no-console

import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import Editor from '../src/editor';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';
import getPropsPreset from '../src/create-editor/get-props-preset';
import ToolsDrawer from '../example-helpers/ToolsDrawer';

const SAVE_ACTION = () => console.log('Save');
const analyticsHandler = (actionName, props) => console.log(actionName, props);
const exampleDocument = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Some example document with emojis ' },
        {
          type: 'emoji',
          attrs: {
            shortName: ':catchemall:',
            id: 'atlassian-catchemall',
            text: ':catchemall:',
          },
        },
        { type: 'text', text: ' and mentions ' },
        {
          type: 'mention',
          attrs: { id: '0', text: '@Carolyn', accessLevel: '' },
        },
        { type: 'text', text: '. ' },
      ],
    },
  ],
};

export default function Example() {
  return (
    <EditorContext>
      <div>
        <WithEditorActions
          render={actions => (
            <ButtonGroup>
              <Button onClick={() => actions.replaceDocument(exampleDocument)}>
                Load Document
              </Button>
              <Button onClick={() => actions.clear()}>Clear</Button>
              <Button
                onClick={() =>
                  actions.replaceSelection({
                    type: 'mention',
                    attrs: {
                      id: 'ABCDE-ABCDE-ABCDE-ABCDE',
                      text: '@Bradley Ayers',
                      userType: 'APP',
                    },
                  })
                }
              >
                Inser mention
              </Button>
              <Button
                onClick={() =>
                  actions.replaceSelection({
                    type: 'codeBlock',
                    attrs: {
                      language: 'javascript',
                    },
                    content: [],
                  })
                }
              >
                Inser code block
              </Button>
              <Button onClick={() => actions.replaceSelection('')}>
                Delete selection
              </Button>
            </ButtonGroup>
          )}
        />
        <ToolsDrawer
          renderEditor={({
            disabled,
            mentionProvider,
            emojiProvider,
            mediaProvider,
            taskDecisionProvider,
            contextIdentifierProvider,
            onChange,
          }) => (
            <Editor
              {...getPropsPreset('message')}
              analyticsHandler={analyticsHandler}
              disabled={disabled}
              maxHeight={305}
              mentionProvider={mentionProvider}
              emojiProvider={emojiProvider}
              mediaProvider={mediaProvider}
              taskDecisionProvider={taskDecisionProvider}
              contextIdentifierProvider={contextIdentifierProvider}
              onChange={onChange}
              onSave={SAVE_ACTION}
              quickInsert={true}
            />
          )}
        />
      </div>
    </EditorContext>
  );
}
