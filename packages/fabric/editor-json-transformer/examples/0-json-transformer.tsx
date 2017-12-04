import * as React from 'react';
import { PureComponent } from 'react';
import Editor from '@atlaskit/editor-bitbucket';
import { JSONTransformer } from '../src';

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');

export type Props = {};
export type State = { json?: {} };

const jsonPretty = (obj: any) => JSON.stringify(obj, null, 2);

export class Example extends PureComponent<Props, State> {
  state: State = { json: {} };
  serializer = new JSONTransformer();

  handleChange = (editor: Editor) => {
    this.setState({ json: this.serializer.encode(editor.doc!) });
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
          <pre>{jsonPretty(this.state.json)}</pre>
        </fieldset>
      </div>
    );
  }
}
