import * as React from 'react';

import Editor from './../src/editor';
import RefApp from '../example-helpers/RefApp';
import getPropsPreset from '../src/editor/create-editor/get-props-preset';

export default class MessageRenderer extends React.PureComponent<any, any> {
  render() {
    return (
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
            />
          );
        }}
      />
    );
  }
}
