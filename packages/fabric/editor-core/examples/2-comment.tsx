// tslint:disable:no-console

import * as React from 'react';

import Button, { ButtonGroup } from '@atlaskit/button';
import Editor from './../src/editor';
import EditorContext from './../src/editor/ui/EditorContext';
import WithEditorActions from './../src/editor/ui/WithEditorActions';
import ToolbarHelp from './../src/editor/ui/ToolbarHelp';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import CollapsedEditor from '../src/editor/ui/CollapsedEditor';
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
                    allowTextFormatting={true}
                    allowTasksAndDecisions={true}
                    allowHyperlinks={true}
                    allowCodeBlocks={true}
                    allowLists={true}
                    allowRule={true}
                    allowTables={true}
                    allowHelpDialog={true}
                    allowPlaceholderCursor={true}
                    disabled={disabled}
                    mentionProvider={mentionProvider}
                    emojiProvider={emojiProvider}
                    mediaProvider={mediaProvider}
                    legacyImageUploadProvider={imageUploadProvider}
                    onChange={onChange}
                    onSave={SAVE_ACTION}
                    onCancel={CANCEL_ACTION}
                    primaryToolbarComponents={[
                      <ToolbarFeedback
                        packageVersion={version}
                        packageName={name}
                        key="toolbar-feedback"
                      />,
                      <ToolbarHelp
                        editorWidth={undefined}
                        key="toolbar-help"
                      />,
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
