import * as React from 'react';

import Editor from './../src/editor';
import RefApp from '../example-helpers/RefApp';

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
              appearance="message"
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
