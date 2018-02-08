import * as React from 'react';
import Editor from './../src/editor';

export default function Example() {
  return (
    <div>
      <p>Editor that is used by mobile applications.</p>
      <Editor
        appearance="mobile"
        allowHyperlinks={true}
        allowTextFormatting={true}
        allowMentions={true}
      />
    </div>
  );
}
