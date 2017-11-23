import * as React from 'react';
import { PureComponent } from 'react';
import Editor from '@atlaskit/editor-bitbucket';
import { bitbucketSchema as schema } from '@atlaskit/editor-common';
import { BitbucketTransformer } from '../src';

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');

export type Props = {};
export type State = { markdown?: string };

export class Example extends PureComponent<Props, State> {
  state: State = { markdown: '' };
  serializer = new BitbucketTransformer(schema);

  handleChange = (editor: Editor) => {
    this.setState({ markdown: this.serializer.encode(editor.doc!) });
  };

  render() {
    return (
      <div ref="root">
        <Editor
          onCancel={CANCEL_ACTION}
          onChange={this.handleChange}
          onSave={SAVE_ACTION}
        />
        <fieldset style={{ marginTop: 20 }}>
          <legend>Markdown</legend>
          <pre>{this.state.markdown}</pre>
        </fieldset>
      </div>
    );
  }
}
