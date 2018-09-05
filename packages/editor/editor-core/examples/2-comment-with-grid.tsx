// tslint:disable:no-console

import * as React from 'react';

import Button, { ButtonGroup } from '@atlaskit/button';
import LockCircleIcon from '@atlaskit/icon/glyph/lock-circle';
import Editor from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import ToolbarHelp from './../src/ui/ToolbarHelp';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import CollapsedEditor from '../src/ui/CollapsedEditor';
import ToolbarFeedback from '../src/ui/ToolbarFeedback';
import { name, version } from '../package.json';

import { customInsertMenuItems } from '@atlaskit/editor-test-helpers';
import { extensionHandlers } from '../example-helpers/extension-handlers';
import { DevTools } from '../example-helpers/DevTools';
import { exampleDocument } from '../example-helpers/grid-document';

const SAVE_ACTION = () => console.log('Save');
const CANCEL_ACTION = () => console.log('Cancel');
const EXPAND_ACTION = () => console.log('Expand');

const analyticsHandler = (actionName, props) => console.log(actionName, props);

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
          <WithEditorActions
            render={actions => (
              <ButtonGroup>
                <Button
                  onClick={() => actions.replaceDocument(exampleDocument)}
                >
                  Load Document
                </Button>
                <Button onClick={() => actions.clear()}>Clear</Button>
              </ButtonGroup>
            )}
          />
          <ToolsDrawer
            renderEditor={({
              mentionProvider,
              emojiProvider,
              mediaProvider,
              activityProvider,
              taskDecisionProvider,
              contextIdentifierProvider,
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
                    quickInsert={true}
                    allowTasksAndDecisions={true}
                    allowCodeBlocks={true}
                    allowTextColor={true}
                    allowLists={true}
                    allowRule={true}
                    allowTables={true}
                    allowHelpDialog={true}
                    allowGapCursor={true}
                    disabled={disabled}
                    activityProvider={activityProvider}
                    mentionProvider={mentionProvider}
                    emojiProvider={emojiProvider}
                    media={{
                      provider: mediaProvider,
                      allowMediaSingle: true,
                    }}
                    taskDecisionProvider={taskDecisionProvider}
                    contextIdentifierProvider={contextIdentifierProvider}
                    UNSAFE_mediaSingle_grid={true}
                    onChange={onChange}
                    onSave={SAVE_ACTION}
                    onCancel={CANCEL_ACTION}
                    primaryToolbarComponents={
                      <>
                        <ToolbarFeedback
                          product={'bitbucket'}
                          packageVersion={version}
                          packageName={name}
                          key="toolbar-feedback"
                        />
                        <ToolbarHelp key="toolbar-help" />
                      </>
                    }
                    allowExtension={true}
                    insertMenuItems={customInsertMenuItems}
                    extensionHandlers={extensionHandlers}
                    secondaryToolbarComponents={[
                      <LockCircleIcon
                        key="permission"
                        size="large"
                        label="Permissions"
                      />,
                    ]}
                  />
                </CollapsedEditor>
              </div>
            )}
          />
          <DevTools />
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
