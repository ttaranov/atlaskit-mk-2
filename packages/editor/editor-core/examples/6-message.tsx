import * as React from 'react';
import { AnalyticsDecorator, AnalyticsListener } from '@atlaskit/analytics';

import { EditorWithAnalytics } from './../src/editor';
import { EditorContext } from '../src';
import getPropsPreset from './../src/create-editor/get-props-preset';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { DevTools } from '../example-helpers/DevTools';
import { IntlProvider } from 'react-intl';

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
            <AnalyticsListener onEvent={analyticsHandler}>
              <AnalyticsDecorator data={{ editorType: 'message' }}>
                <IntlProvider locale="en">
                  <EditorWithAnalytics
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
                </IntlProvider>
              </AnalyticsDecorator>
            </AnalyticsListener>
          )}
        />
        <DevTools />
      </div>
    </EditorContext>
  );
}
