import * as React from 'react';
import { AnalyticsDecorator, AnalyticsListener } from '@atlaskit/analytics';

import { EditorWithAnalytics } from './../src/editor';
import EditorContext from './../src/editor/ui/EditorContext';
import WithHelpTrigger from './../src/editor/ui/WithHelpTrigger';
import getPropsPreset from './../src/editor/create-editor/get-props-preset';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { storyDecorator } from '../src/test-helper';
import { Addon, AddonConfiguration } from '../src/editor/ui/Addon';
import DocumentIcon from '@atlaskit/icon/glyph/document';
import QuestionIcon from '@atlaskit/icon/glyph/editor/help';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import styled from 'styled-components';

const SAVE_ACTION = () => console.log('Save');
const analyticsHandler = (actionName, props) => console.log(actionName, props);

export default function Example() {
  return (
    <ToolsDrawer
      // tslint:disable-next-line:jsx-no-lambda
      renderEditor={({
        mentionProvider,
        emojiProvider,
        mediaProvider,
        onChange,
      }) => (
        <AnalyticsListener onEvent={analyticsHandler}>
          <AnalyticsDecorator data={{ editorType: 'message' }}>
            <EditorWithAnalytics
              {...getPropsPreset('message')}
              analyticsHandler={analyticsHandler}
              maxHeight={305}
              mentionProvider={mentionProvider}
              emojiProvider={emojiProvider}
              mediaProvider={mediaProvider}
              onChange={onChange}
              onSave={SAVE_ACTION}
            />
          </AnalyticsDecorator>
        </AnalyticsListener>
      )}
    />
  );
}
