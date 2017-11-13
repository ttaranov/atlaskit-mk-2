import * as React from 'react';

import Button, { ButtonGroup } from '@atlaskit/button';
import Editor from './../src/editor';
import EditorContext from './../src/editor/ui/EditorContext';
import WithEditorActions from './../src/editor/ui/WithEditorActions';
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
      type: 'mediaGroup',
      content: [
        {
          type: 'media',
          attrs: {
            id: '65acab80-fb13-4609-a905-2c9453601faa',
            type: 'file',
            collection: 'MediaServicesSample'
          }
        },
        {
          type: 'media',
          attrs: {
            id: '037f18fe-172a-4513-9edc-8dd708d56cb2',
            type: 'file',
            collection: 'MediaServicesSample'
          }
        },
        {
          type: 'media',
          attrs: {
            id: '0f327ed8-6400-4c9b-b335-3936d9bba75c',
            type: 'file',
            collection: 'MediaServicesSample'
          }
        },
        {
          type: 'media',
          attrs: {
            id: 'e2e48206-d0c2-41d3-8f4c-c34a32ab8971',
            type: 'file',
            collection: 'MediaServicesSample'
          }
        },
        {
          type: 'media',
          attrs: {
            id: '8aca42db-28b2-4ad2-96ee-8d51fc388863',
            type: 'file',
            collection: 'MediaServicesSample'
          }
        },
        {
          type: 'media',
          attrs: {
            id: '915ecec8-d27d-4c33-a529-305ca0509a53',
            type: 'file',
            collection: 'MediaServicesSample'
          }
        },
        {
          type: 'media',
          attrs: {
            id: '6ac69356-88f3-4b5f-82fb-b56ce0cc51b0',
            type: 'file',
            collection: 'MediaServicesSample'
          }
        },
        {
          type: 'media',
          attrs: {
            id: '7490187c-d9cc-42e8-b6fe-1e04a6f1f83d',
            type: 'file',
            collection: 'MediaServicesSample'
          }
        },
        {
          type: 'media',
          attrs: {
            id: '45150b50-6670-45b8-afee-9f8095b5e677',
            type: 'file',
            collection: 'MediaServicesSample'
          }
        },
        {
          type: 'media',
          attrs: {
            id: '73c02e94-6e9d-40ed-b98b-c0e75df0aa28',
            type: 'file',
            collection: 'MediaServicesSample'
          }
        },
        {
          type: 'media',
          attrs: {
            id: '13133443-928d-4c69-b3cd-25a868bad986',
            type: 'file',
            collection: 'MediaServicesSample'
          }
        },
        {
          type: 'media',
          attrs: {
            id: '764b6c19-bcc2-413d-82ad-bbae26e74e90',
            type: 'file',
            collection: 'MediaServicesSample'
          }
        }
      ]
    },
    {
      type: 'paragraph',
      content: []
    }
  ]
};

type Props = {};
type State = {
  hasJquery?: boolean;
  isExpanded?: boolean;
};

export default class EditorWithFeedback extends React.Component<Props, State> {
  state = {
    hasJquery: false,
    isExpanded: false
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
            // tslint:disable-next-line:jsx-no-lambda
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
            // tslint:disable-next-line:jsx-no-lambda
            renderEditor={({
              mentionProvider,
              emojiProvider,
              mediaProvider,
              imageUploadProvider,
              onChange
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
                    shouldFocus={true}
                    allowTextFormatting={true}
                    allowTasksAndDecisions={true}
                    allowHyperlinks={true}
                    allowCodeBlocks={true}
                    allowLists={true}
                    allowTables={true}
                    mentionProvider={mentionProvider}
                    emojiProvider={emojiProvider}
                    mediaProvider={mediaProvider}
                    legacyImageUploadProvider={imageUploadProvider}
                    onChange={onChange}
                    onSave={SAVE_ACTION}
                    onCancel={CANCEL_ACTION}
                    primaryToolbarComponents={
                      <ToolbarFeedback
                        packageVersion={version}
                        packageName={name}
                      />
                    }
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
        hasJquery: true
      });
    };

    document.body.appendChild(scriptElem);
  };
}
