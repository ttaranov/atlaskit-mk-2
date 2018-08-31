// tslint:disable:no-console

import * as React from 'react';
import { Component } from 'react';
import { EditorAppearance, EditorProps } from '../src/types';
import Editor from '../src/editor';
import getPropsPreset from '../src/create-editor/get-props-preset';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { taskDecisionDocFilter } from '../src/utils/filter/';
import { toJSON, JSONDocNode, JSONNode } from '../src/utils/';
import { ProviderFactory } from '@atlaskit/editor-common';
import { ReactRenderer } from '@atlaskit/renderer';

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
      filteredContent: [],
    };
    this.providerFactory = new ProviderFactory();
  }

  onChange = delegateOnChange => editorView => {
    this.setState({
      filteredContent: taskDecisionDocFilter(toJSON(editorView.state.doc)),
    });

    return delegateOnChange(editorView);
  };

  private handleProviders(props: EditorProps) {
    const {
      emojiProvider,
      mentionProvider,
      mediaProvider,
      taskDecisionProvider,
      contextIdentifierProvider,
    } = props;
    this.providerFactory.setProvider('emojiProvider', emojiProvider);
    this.providerFactory.setProvider('mentionProvider', mentionProvider);
    this.providerFactory.setProvider('mediaProvider', mediaProvider);
    this.providerFactory.setProvider(
      'taskDecisionProvider',
      taskDecisionProvider,
    );
    this.providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );
  }

  render() {
    const { filteredContent } = this.state;
    const { appearance = 'message', renderToDocument } = this.props;

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
          renderEditor={({
            disabled,
            mentionProvider,
            emojiProvider,
            mediaProvider,
            taskDecisionProvider,
            contextIdentifierProvider,
            onChange,
          }) => {
            this.handleProviders({
              mentionProvider,
              emojiProvider,
              mediaProvider,
              taskDecisionProvider,
              contextIdentifierProvider,
            });

            return (
              <Editor
                {...getPropsPreset(appearance)}
                analyticsHandler={analyticsHandler}
                disabled={disabled}
                maxHeight={305}
                mentionProvider={mentionProvider}
                emojiProvider={emojiProvider}
                mediaProvider={mediaProvider}
                taskDecisionProvider={taskDecisionProvider}
                contextIdentifierProvider={contextIdentifierProvider}
                onChange={this.onChange(onChange)}
                onSave={SAVE_ACTION}
                quickInsert={true}
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
              },
            ],
          },
        ],
      })}
    />
  );
}
