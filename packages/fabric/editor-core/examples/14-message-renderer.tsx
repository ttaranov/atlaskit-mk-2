import * as React from 'react';

import Editor from './../src/editor';
import RefApp from '../example-helpers/RefApp';

export default function Example() {
  return (
    <RefApp
      // tslint:disable-next-line:jsx-no-lambda
      renderEditor={({ emojiProvider, onChange }) => {
        return (
          <Editor
            appearance="message"
            emojiProvider={emojiProvider}
            maxHeight={305}
            onChange={onChange}
          />
        );
      }}
    />
  );
}
