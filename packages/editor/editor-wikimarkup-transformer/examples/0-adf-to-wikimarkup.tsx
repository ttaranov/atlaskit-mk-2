// tslint:disable:no-console

import * as React from 'react';

import { Editor, EditorContext, CollapsedEditor } from '@atlaskit/editor-core';
import { taskDecision } from '@atlaskit/util-data-test';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';

const SAVE_ACTION = () => console.log('Save');
const CANCEL_ACTION = () => console.log('Cancel');
const EXPAND_ACTION = () => console.log('Expand');

const analyticsHandler = (actionName, props) => console.log(actionName, props);

const mediaProvider = storyMediaProviderFactory({
  useMediaPickerAuthProvider: true,
  includeUploadContext: true,
  includeUserAuthProvider: true,
  collectionName: 'test',
});

export type Props = {};
export type State = {
  hasJquery?: boolean;
  isExpanded?: boolean;
};

export default class EditorWithFeedback extends React.Component<Props, State> {
  state = {
    hasJquery: false,
    isExpanded: false,
  };

  componentDidMount() {
    delete window.jQuery;
    this.loadJquery();
  }

  onFocus = () =>
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));

  render() {
    if (!this.state.hasJquery) {
      return <h3>Please wait, loading jQuery ...</h3>;
    }

    return (
      <EditorContext>
        <div>
          <ToolsDrawer
            renderEditor={({
              mentionProvider,
              emojiProvider,
              imageUploadProvider,
              onChange,
              disabled,
            }) => (
              <div style={{ padding: '20px' }}>
                <CollapsedEditor
                  placeholder="What do you want to say?"
                  isExpanded={this.state.isExpanded}
                  onFocus={this.onFocus}
                  onExpand={EXPAND_ACTION}
                >
                  <Editor
                    appearance="comment"
                    placeholder="What do you want to say?"
                    analyticsHandler={analyticsHandler}
                    shouldFocus={true}
                    allowCodeBlocks={true}
                    allowTextColor={true}
                    allowLists={true}
                    allowRule={true}
                    allowTables={{
                      allowColumnResizing: true,
                      allowMergeCells: true,
                      allowNumberColumn: true,
                      allowBackgroundColor: true,
                      allowHeaderRow: true,
                      allowHeaderColumn: true,
                      permittedLayouts: 'all',
                      stickToolbarToBottom: true,
                    }}
                    allowDate={true}
                    media={{ provider: mediaProvider, allowMediaSingle: true }}
                    disabled={disabled}
                    mentionProvider={mentionProvider}
                    taskDecisionProvider={Promise.resolve(
                      taskDecision.getMockTaskDecisionResource(),
                    )}
                    onChange={onChange}
                    onSave={SAVE_ACTION}
                    onCancel={CANCEL_ACTION}
                  />
                </CollapsedEditor>
              </div>
            )}
          />
        </div>
      </EditorContext>
    );
  }

  private loadJquery = () => {
    const scriptElem = document.createElement('script');
    scriptElem.type = 'text/javascript';
    scriptElem.src =
      'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js';

    scriptElem.onload = () => {
      this.setState({
        ...this.state,
        hasJquery: true,
      });
    };

    document.body.appendChild(scriptElem);
  };
}
