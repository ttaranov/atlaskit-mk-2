import * as React from 'react';

import Editor from './../src/editor';
import { EditorContext } from '../src';
import getPropsPreset from './../src/create-editor/get-props-preset';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { DevTools } from '../example-helpers/DevTools';

// tslint:disable-next-line:no-console
const SAVE_ACTION = () => console.log('Save');

// tslint:disable-next-line:no-console
const analyticsHandler = (actionName, props) => console.log(actionName, props);

export default function Example() {
  return (
    <EditorContext>
      <div>
        <ToolsDrawer
          // tslint:disable-next-line:jsx-no-lambda
          renderEditor={({
            disabled,
            mentionProvider,
            emojiProvider,
            taskDecisionProvider,
            contextIdentifierProvider,
            mediaProvider,
            onChange,
          }) => (
            <Editor
              {...getPropsPreset('message')}
              quickInsert={true}
              analyticsHandler={analyticsHandler}
              disabled={disabled}
              maxHeight={305}
              maxContentSize={500}
              mentionProvider={mentionProvider}
              emojiProvider={emojiProvider}
              mediaProvider={mediaProvider}
              taskDecisionProvider={taskDecisionProvider}
              contextIdentifierProvider={contextIdentifierProvider}
              onChange={onChange}
              onSave={SAVE_ACTION}
            />
          )}
        />
        <DevTools />
      </div>
    </EditorContext>
  );
}
