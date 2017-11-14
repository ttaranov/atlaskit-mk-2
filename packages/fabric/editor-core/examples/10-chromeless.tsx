import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import Editor from '../src/editor';
import EditorContext from '../src/editor/ui/EditorContext';
import WithEditorActions from '../src/editor/ui/WithEditorActions';
import ToolsDrawer from '../example-helpers/ToolsDrawer';

const SAVE_ACTION = () => console.log('Save');
const analyticsHandler = (actionName, props) => console.log(actionName, props);
const exampleDocument = {
  "version": 1,
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Testing message editing with a large amount"
        },
        {
          "type": "hardBreak"
        },
        {
          "type": "text",
          "text": "of"
        },
        {
          "type": "hardBreak"
        },
        {
          "type": "text",
          "text": "lines"
        },
        {
          "type": "hardBreak"
        },
        {
          "type": "text",
          "text": "seriously a lot of lines"
        },
        {
          "type": "hardBreak"
        },
        {
          "type": "text",
          "text": "are in this message"
        }
      ]
    }
  ]
}

class ShowHider extends React.Component<{ children: any }, { isShown: boolean }> {
  constructor(props) {
    super(props);
    this.state = {
      isShown: false,
    }
  }
  render() {
    return (
      <div>
        <button onClick={() => this.setState(state => ({ isShown: !state.isShown }))}>click me</button>
        { this.props.children(this.state.isShown) }
      </div>
    );
  }
}

export default function Example() {
  return (
    <EditorContext>
      <div>
        <WithEditorActions
          // tslint:disable-next-line:jsx-no-lambda
          render={actions =>
            <ButtonGroup>
              <Button onClick={() => actions.replaceDocument(exampleDocument)}>Load Document</Button>
              <Button onClick={() => actions.clear()}>Clear</Button>
            </ButtonGroup>
          }
        />
        <ToolsDrawer
          // tslint:disable-next-line:jsx-no-lambda
          renderEditor={({ mentionProvider, emojiProvider, mediaProvider, onChange }) =>
            <ShowHider>
              {(isShown) => isShown && (
                <Editor
                  appearance="chromeless"
                  analyticsHandler={analyticsHandler}
                  shouldFocus={true}

                  allowTextFormatting={true}
                  allowTasksAndDecisions={true}
                  allowHyperlinks={true}
                  allowCodeBlocks={true}

                  saveOnEnter={true}

                  mentionProvider={mentionProvider}
                  emojiProvider={emojiProvider}
                  mediaProvider={mediaProvider}

                  onChange={onChange}
                  onSave={SAVE_ACTION}
                  defaultValue={exampleDocument}
                />
              )}
            </ShowHider>
          }
        />
      </div>
    </EditorContext>
  );
}
