import * as React from 'react';
import Editor from './../src/labs/EditorWithActions';

export default function Example() {
  return (
    <div>
      <Editor
        appearance="comment"
        onSave={actions =>
          actions
            .getValue()
            .then(value => alert(JSON.stringify(value, null, 2)))
        }
        onCancel={actions => actions.clear()}
      />
    </div>
  );
}
