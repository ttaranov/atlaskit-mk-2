import * as React from 'react';

import Button, { ButtonGroup } from '@atlaskit/button';
import { EditorView } from 'prosemirror-view';
import Editor, { EditorProps } from './../src/editor';
import { toJSON } from './../src/utils';
import EditorContext from './../src/editor/ui/EditorContext';
import WithEditorActions from './../src/editor/ui/WithEditorActions';
import ToolbarHelp from './../src/editor/ui/ToolbarHelp';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import CollapsedEditor from '../src/editor/ui/CollapsedEditor';
import ToolbarFeedback from '../src/ui/ToolbarFeedback';
import { JSONDocNode } from '../src/transformers/json/index';

const appearanceProps = {
  message: {
    saveOnEnter: true,

    allowTextFormatting: true,
    allowLists: true,
    allowTextColor: true,
    allowHyperlinks: true,
    allowCodeBlocks: true,
    allowTasksAndDecisions: true,
    allowHelpDialog: true,
    shouldFocus: true
  },
  comment: {
    allowTextFormatting: true,
    allowLists: true,
    allowTextColor: true,
    allowHyperlinks: true,
    allowCodeBlocks: true,
    allowTasksAndDecisions: true,
    allowHelpDialog: true,

    shouldFocus: true
  }
}

export interface State {
  appearance: 'comment' | 'message'
}

class AdaptiveEditor extends React.Component<EditorProps, {}> {
  state = {
    appearance: 'message'
  }
  value: JSONDocNode;

  onEditorChange = (editorView: EditorView) => {
    this.value = toJSON(editorView.state.doc);
    console.log(this.value)
    if (this.props.appearance !== 'comment' && JSON.stringify(this.value).indexOf('codeBlock') !== -1) {
      this.setState({ appearance: 'comment' });
    }
    if (this.props.appearance !== 'comment' && JSON.stringify(this.value).indexOf('List') !== -1) {
      this.setState({ appearance: 'comment' });
    }
    if (this.props.appearance !== 'message' && JSON.stringify(this.value).indexOf('codeBlock') === -1 && JSON.stringify(this.value).indexOf('List') === -1) {
      this.setState({ appearance: 'message' });
    }
  }

  render() {
    if (this.props.appearance === 'comment') {
      <Editor
        {...this.props}
        appearance={this.state.appearance}
        {...appearanceProps[this.state.appearance]}
        onChange={this.onEditorChange}
        defaultValue={this.value}
      />
    }
    return (
      <div>
        <Editor
          {...this.props}
          appearance={this.state.appearance}
          {...appearanceProps[this.state.appearance]}
          onChange={this.onEditorChange}
          defaultValue={this.value}
        />
      </div>
    )
  }
}

export default class AdaptiveEditorExample extends React.Component<{}, {}> {

  render() {
    return (
      <EditorContext>
        <div>
          <ToolsDrawer
            // tslint:disable-next-line:jsx-no-lambda
            renderEditor={({ mentionProvider, emojiProvider, mediaProvider, onChange }) =>
              <div style={{ padding: '20px' }}>
                <WithEditorActions
                  render={actions =>
                    <AdaptiveEditor
                      shouldFocus={true}

                      mentionProvider={mentionProvider}
                      emojiProvider={emojiProvider}
                      mediaProvider={mediaProvider}

                      onChange={onChange}
                    />
                  }
                />
              </div>}
          />
        </div>
      </EditorContext>
    );
  }

}
