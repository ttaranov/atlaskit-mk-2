import * as React from 'react';
import { AnalyticsDecorator, AnalyticsListener } from '@atlaskit/analytics';

import { EditorWithAnalytics } from './../src/editor';
import getPropsPreset from './../src/editor/create-editor/get-props-preset';
import ToolsDrawer from '../example-helpers/ToolsDrawer';

// tslint:disable-next-line:no-console
const SAVE_ACTION = () => console.log('Save');

// tslint:disable-next-line:no-console
const analyticsHandler = (actionName, props) => console.log(actionName, props);

export default function Example() {
  return (
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
        <AnalyticsListener onEvent={analyticsHandler}>
          <AnalyticsDecorator data={{ editorType: 'message' }}>
            <EditorWithAnalytics
              {...getPropsPreset('message')}
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
          </AnalyticsDecorator>
        </AnalyticsListener>
      )}
    />
  );
}
