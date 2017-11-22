import * as React from 'react';

import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
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

  onEditorChange = (editorView) => {
    this.value = toJSON(editorView.state.doc);

    if (this.state.appearance === 'comment') {
      if (JSON.stringify(this.value).indexOf('tadah') !== -1) {
        this.setState({ appearance: 'message' });
      }
    } else if (this.state.appearance === 'message') {
      if (JSON.stringify(this.value).indexOf('List') !== -1 || JSON.stringify(this.value).indexOf('codeBlock') !== -1 || JSON.stringify(this.value).indexOf('heading') !== -1 ) {
        this.setState({ appearance: 'comment' });
      }
    }
  }

  render() {
    return(
      <div style={{ display: 'flex' }}>
        <Button
          onClick={() => this.setState(prevState => ({ appearance: prevState.appearance === 'comment' ? 'message': 'comment' }))}
          iconAfter={this.state.appearance === 'comment'
            ? <ChevronDownIcon label="collapse"/>
            : <ChevronUpIcon label="expand" />}
        />
        <span style={{ marginRight: '8px' }} />
        {
          this.state.appearance === 'comment'
            ? (
              <Editor
                {...this.props}
                appearance={this.state.appearance}
                {...appearanceProps[this.state.appearance]}
                onChange={this.onEditorChange}
                defaultValue={this.value}
              />
            ) : (
              <div style={{ flexGrow: 1}}>
                <Editor
                  {...this.props}
                  appearance={this.state.appearance}
                  {...appearanceProps[this.state.appearance]}
                  onChange={this.onEditorChange}
                />
              </div>
            )
        }
      </div>
    )
  }
}

export default class AdaptiveEditorExample extends React.Component<{}, {}> {

  render() {
    return (
      <div>
        <ToolsDrawer
          // tslint:disable-next-line:jsx-no-lambda
          renderEditor={({ mentionProvider, emojiProvider, mediaProvider, onChange }) =>
            <div style={{ padding: '20px' }}>
              <AdaptiveEditor
                mentionProvider={mentionProvider}
                emojiProvider={emojiProvider}
                mediaProvider={mediaProvider}
              />
            </div>
          }
        />
      </div>
    );
  }

}
