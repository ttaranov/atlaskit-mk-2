import * as React from 'react';
import { Component } from 'react';
import { EditorAppearance, EditorProps } from '../src/editor/types';
import Editor from '../src/editor';
import getPropsPreset from '../src/editor/create-editor/get-props-preset';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { storyDecorator } from '../src/test-helper';
import { taskDecisionDocFilter } from '../src/utils/filter/';
import { toJSON, JSONDocNode, JSONNode } from '../src/utils/';
import { ProviderFactory } from '../src';
import { ReactRenderer } from '../src/renderer';

const SAVE_ACTION = () => console.log('Save');
const analyticsHandler = (actionName, props) => console.log(actionName, props);

interface State {
  filteredContent: JSONNode[];
}

interface Props {
  appearance?: EditorAppearance;
  renderToDocument: (content: JSONNode[]) => JSONDocNode;
}

class DecisionBuilderToolsDrawer extends Component<Props, State> {
  private providerFactory: ProviderFactory;

  constructor(props) {
    super(props);
    this.state = {
      filteredContent: []
    };
    this.providerFactory = new ProviderFactory();
  }

  onChange = delegateOnChange => editorView => {
    this.setState({
      filteredContent: taskDecisionDocFilter(toJSON(editorView.state.doc))
    });

    return delegateOnChange(editorView);
  }

  private handleProviders(props: EditorProps) {
    const { emojiProvider, mentionProvider, mediaProvider } = props;
    this.providerFactory.setProvider('emojiProvider', emojiProvider);
    this.providerFactory.setProvider('mentionProvider', mentionProvider);
    this.providerFactory.setProvider('mediaProvider', mediaProvider);
  }

  render() {
    const { filteredContent } = this.state;
    const { appearance, renderToDocument } = this.props;

    return (
      <div>
        <h4>Decision:</h4>
        <ReactRenderer
          document={renderToDocument(filteredContent)}
          dataProviders={this.providerFactory}
        />
        <h5>Content:</h5>
        <pre>{JSON.stringify(filteredContent, undefined, 2)}</pre>
        <h4>Raw content:</h4>
        <ToolsDrawer
          // tslint:disable-next-line:jsx-no-lambda
          renderEditor={({mentionProvider, emojiProvider, mediaProvider, onChange}) => {
            this.handleProviders({ mentionProvider, emojiProvider, mediaProvider });

            return (
              <Editor
                {...getPropsPreset(appearance)}
                analyticsHandler={analyticsHandler}
                maxHeight={305}

                mentionProvider={mentionProvider}
                emojiProvider={emojiProvider}
                mediaProvider={mediaProvider}

                onChange={this.onChange(onChange)}
                onSave={SAVE_ACTION}
              />
            );
          }}
        />
      </div>
    );
  }
}

export default function Example() {
  return (
    <DecisionBuilderToolsDrawer
      appearance="message"
      // tslint:disable-next-line:jsx-no-lambda
      renderToDocument={content => ({
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'decisionList',
            content: [
              {
                type: 'decisionItem',
                content,
              }
            ]
          }
        ]
      })}
    />
  );
}
