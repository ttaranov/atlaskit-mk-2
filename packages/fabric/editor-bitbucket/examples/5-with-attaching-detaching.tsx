// tslint:disable:no-console
import * as React from 'react';
import { base64fileconverter } from '@atlaskit/editor-test-helpers';
import { default as Editor } from '../src';
import BitbucketStyles from '../example-helpers/bitbucketStyles';

const CHANGE_ACTION = () => console.log('Change');
const SAVE_ACTION = () => console.log('Save');

export default class Example extends React.Component<{}, {}> {
  private ref: Node;
  private editor;

  render() {
    return (
      <BitbucketStyles>
        <div id="editor">
          <div ref={this.handleDivRef}>
            <Editor
              ref={this.handleEditorRef}
              onCancel={this.handleEditorCancel}
              onChange={CHANGE_ACTION}
              onSave={SAVE_ACTION}
              isExpandedByDefault={true}
            />
          </div>
        </div>
        <button onClick={this.handleButtonClick}>Attach</button>
      </BitbucketStyles>
    );
  }

  private handleDivRef = elem => {
    this.ref = elem as Node;
  };

  private handleEditorRef = elem => {
    this.editor = elem;
  };

  private handleEditorCancel = () => {
    (this.ref.parentNode as Node).removeChild(this.ref);
  };

  private handleButtonClick = () => {
    (document.getElementById('editor') as Node).appendChild(this.ref);
    if (this.editor) {
      this.editor.clear();
    }
  };
}
