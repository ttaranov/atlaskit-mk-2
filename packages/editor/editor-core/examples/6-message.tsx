import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics';
import { AnalyticsListener as AnalyticsNextListener } from '@atlaskit/analytics-next';

import { EditorWithAnalytics } from './../src/editor';
import getPropsPreset from './../src/create-editor/get-props-preset';
import ToolsDrawer from '../example-helpers/ToolsDrawer';

// tslint:disable-next-line:no-console
const SAVE_ACTION = () => console.log('Save');

// tslint:disable-next-line:no-console
const analyticsHandler = (actionName, props) =>
  console.log('@atlaskit/analytics', actionName, props);
// tslint:disable-next-line:no-console
const analyticsNextHandler = ({ payload, context }) =>
  console.log('@atlaskit/analytics-next', payload, context);

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
        <AnalyticsNextListener onEvent={analyticsNextHandler}>
          <AnalyticsListener onEvent={analyticsHandler}>
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
          </AnalyticsListener>
        </AnalyticsNextListener>
      )}
    />
  );
}
