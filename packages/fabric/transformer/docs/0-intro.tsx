import * as React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  # Transformer

  ## Installation

  ~~~sh
  npm install @atlaskit/transformer
  ~~~

  ## Using the library

  Use the component in your React app as follows:

  ~~~js
  import { BitbucketTransformer } from '@atlaskit/transformer';
  const serializer = new BitbucketTransformer(schema);
  serializer.encode(editor.doc!)
  ~~~

  ## Example

  An example of Bitbucket serializer:

  ~~~js
  import * as React from 'react';
  import { PureComponent } from 'react';
  import Editor from '@atlaskit/editor-bitbucket';
  import { bitbucketSchema as schema } from '@atlaskit/editor-common';
  import { BitbucketTransformer } from '../src';

  export default class Example extends PureComponent<Props, State> {
    state: State = { markdown: '' };
    serializer = new BitbucketTransformer(schema);

    handleChange = (editor: Editor) => {
      this.setState({ markdown: this.serializer.encode(editor.doc!) });
    };

    render() {
      return (
        <Editor
          onCancel={CANCEL_ACTION}
          onChange={this.handleChange}
          onSave={SAVE_ACTION}
        />
      );
    }
  }
  ~~~

`;
