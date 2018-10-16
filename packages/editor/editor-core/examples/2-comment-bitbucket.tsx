// tslint:disable:no-console

import * as React from 'react';

import Button, { ButtonGroup } from '@atlaskit/button';
import Editor from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import ToolbarHelp from './../src/ui/ToolbarHelp';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import CollapsedEditor from '../src/ui/CollapsedEditor';
import ToolbarFeedback from '../src/ui/ToolbarFeedback';
import { name, version } from '../package.json';

const SAVE_ACTION = () => console.log('Save');
const CANCEL_ACTION = () => console.log('Cancel');
const EXPAND_ACTION = () => console.log('Expand');

const analyticsHandler = (actionName, props) => console.log(actionName, props);
const exampleDocument = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Some example document with emojis ' },
        {
          type: 'emoji',
          attrs: {
            shortName: ':catchemall:',
            id: 'atlassian-catchemall',
            text: ':catchemall:',
          },
        },
        { type: 'text', text: ' and mentions ' },
        {
          type: 'mention',
          attrs: { id: '0', text: '@Carolyn', accessLevel: '' },
        },
        { type: 'text', text: '. ' },
      ],
    },
  ],
};

export type Props = {};
export type State = {
  isExpanded?: boolean;
};

export default class EditorWithFeedback extends React.Component<Props, State> {
  state = {
    isExpanded: true,
  };

  onFocus = () =>
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));

  render() {
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
            imageUploadProvider="resolved"
            renderEditor={({
              mentionProvider,
              emojiProvider,
              activityProvider,
              taskDecisionProvider,
              contextIdentifierProvider,
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
                    analyticsHandler={analyticsHandler}
                    allowCodeBlocks={true}
                    allowLists={true}
                    allowTables={{
                      isHeaderRowRequired: true,
                    }}
                    textFormatting={{
                      disableSuperscriptAndSubscript: true,
                      disableUnderline: true,
                    }}
                    allowHelpDialog={true}
                    disabled={disabled}
                    mentionProvider={mentionProvider}
                    emojiProvider={emojiProvider}
                    legacyImageUploadProvider={imageUploadProvider}
                    shouldFocus={true}
                    onChange={onChange}
                    onSave={SAVE_ACTION}
                    onCancel={CANCEL_ACTION}
                    quickInsert={true}
                    primaryToolbarComponents={[
                      <ToolbarFeedback
                        packageVersion={version}
                        packageName={name}
                        key="toolbar-feedback"
                      />,
                      <ToolbarHelp key="toolbar-help" />,
                    ]}
                  />
                </CollapsedEditor>
              </div>
            )}
          />
        </div>
      </EditorContext>
    );
  }
}
