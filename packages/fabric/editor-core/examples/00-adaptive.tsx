import * as React from 'react';

import WithEditorActions from '../src/editor/ui/WithEditorActions';
import EditorContext from '../src/editor/ui/EditorContext';
import ToolbarHelp from './../src/editor/ui/ToolbarHelp';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import ChameleonEditor from '../src/editor/ui/ChameleonEditor';
import ToolbarFeedback from '../src/ui/ToolbarFeedback';
import { JSONDocNode } from '../src/transformers/json/index';

export default class AdaptiveEditorExample extends React.Component<{}, {}> {

  onSave = actions => editorView => {
    window.alert('Saved!');
    actions.clear();
  }

  render() {
    return (
      <EditorContext>
        <div>
          <ToolsDrawer
            // tslint:disable-next-line:jsx-no-lambda
            renderEditor={({ mentionProvider, emojiProvider, mediaProvider, onChange }) =>
              <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 88px)' }}>
                <h1 style={{ padding: '40px 40px 0px 40px' }}>Editor Room</h1>
                <div style={{ flexGrow: 1 }} />
                <WithEditorActions render={actions => (
                  <ChameleonEditor
                    editorProps={{
                      allowTextFormatting: true,
                      allowLists: true,
                      allowTextColor: true,
                      allowHyperlinks: true,
                      allowCodeBlocks: true,
                      allowTasksAndDecisions: true,
                      allowHelpDialog: true,
                      shouldFocus: true,

                      mentionProvider,
                      emojiProvider,
                      mediaProvider,
                    }}
                    apperanceProps={{
                      message: {
                        saveOnEnter: true,
                        onSave: this.onSave(actions),
                      },
                      comment: {
                        secondaryToolbarComponents: <a onClick={this.onSave(actions)}>Send</a>
                      }
                    }}
                  />
                )}/>
              </div>
            }
          />
        </div>
      </EditorContext>
    );
  }

}
