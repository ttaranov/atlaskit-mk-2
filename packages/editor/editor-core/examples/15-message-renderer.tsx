import * as React from 'react';

import Editor from './../src/editor';
import RefApp from '../example-helpers/RefApp';
import getPropsPreset from '../src/create-editor/get-props-preset';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';
import Button, { ButtonGroup } from '@atlaskit/button';

const exampleAction = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'taskList',
      attrs: {
        localId: '4a92fee1-c91b-4e8f-8c81-feb56fd4eae7',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: 'ccaacf62-ea3d-46f8-879b-6969a23021bd',
            state: 'TODO',
          },
          content: [
            {
              type: 'text',
              text: 'a preloaded action',
            },
          ],
        },
      ],
    },
  ],
};

const exampleDecision = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'decisionList',
      attrs: {
        localId: '4a92fee1-c91b-4e8f-8c81-feb56fd4eae7',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: 'ccaacf62-ea3d-46f8-879b-6969a23021bd',
          },
          content: [
            {
              type: 'text',
              text: 'a preloaded decision',
            },
          ],
        },
      ],
    },
  ],
};

export default class MessageRenderer extends React.PureComponent<any, any> {
  render() {
    return (
      <EditorContext>
        <div>
          <WithEditorActions
            render={actions => (
              <ButtonGroup>
                <Button onClick={() => actions.replaceDocument(exampleAction)}>
                  Load Action
                </Button>
                <Button
                  onClick={() => actions.replaceDocument(exampleDecision)}
                >
                  Load Decision
                </Button>
                <Button onClick={() => actions.clear()}>Clear</Button>
              </ButtonGroup>
            )}
          />
          <RefApp
            // tslint:disable-next-line:jsx-no-lambda
            renderEditor={({
              emojiProvider,
              mentionProvider,
              taskDecisionProvider,
              contextIdentifierProvider,
              onChange,
            }) => {
              return (
                <Editor
                  {...getPropsPreset('message')}
                  emojiProvider={emojiProvider}
                  mentionProvider={mentionProvider}
                  taskDecisionProvider={taskDecisionProvider}
                  contextIdentifierProvider={contextIdentifierProvider}
                  maxHeight={305}
                  onChange={onChange}
                  quickInsert={true}
                />
              );
            }}
          />
        </div>
      </EditorContext>
    );
  }
}
