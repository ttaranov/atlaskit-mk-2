import * as React from 'react';
import { storyData as mentionStoryData } from '@atlaskit/mention/dist/es5/support';
import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
import { storyData as taskDecisionStoryData } from '@atlaskit/task-decision/dist/es5/support';
import { ReactRenderer } from '@atlaskit/renderer';

import { Content } from './styles';
import { toJSON } from '../src/utils';
import { ProviderFactory } from '@atlaskit/editor-common';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers';

const emojiProvider = emojiStoryData.getEmojiResource({
  uploadSupported: true,
});
const mentionProvider = Promise.resolve(mentionStoryData.resourceProvider);
const taskDecisionProvider = Promise.resolve(
  taskDecisionStoryData.getMockTaskDecisionResource(),
);
const contextIdentifierProvider = storyContextIdentifierProviderFactory();

export interface State {
  reloadEditor: boolean;
  jsonDocument?: string;
}

export default class ToolsDrawer extends React.Component<any, State> {
  private providerFactory: ProviderFactory;

  constructor(props) {
    super(props);

    this.providerFactory = new ProviderFactory();
    this.providerFactory.setProvider('emojiProvider', emojiProvider);
    this.providerFactory.setProvider('mentionProvider', mentionProvider);
    this.providerFactory.setProvider(
      'taskDecisionProvider',
      taskDecisionProvider,
    );
    this.providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );

    this.state = {
      reloadEditor: false,
      jsonDocument: '{}',
    };
  }

  private onChange = editorView => {
    this.setState({
      jsonDocument: JSON.stringify(toJSON(editorView.state.doc), null, 2),
    });
  };

  private renderRenderer(doc) {
    try {
      const props: any = {
        document: JSON.parse(doc),
        dataProviders: this.providerFactory,
      };
      return (
        <div>
          <div style={{ color: '#ccc', marginBottom: '8px' }}>
            &lt;Renderer&gt;
          </div>
          <ReactRenderer {...props} />
          <div style={{ color: '#ccc', marginTop: '8px' }}>
            &lt;/Renderer&gt;
          </div>
        </div>
      );
    } catch (ex) {
      return <pre>Invalid document: {ex.stack}</pre>;
    }
  }

  render() {
    const { reloadEditor, jsonDocument } = this.state;
    return (
      <Content>
        {reloadEditor
          ? ''
          : this.props.renderEditor({
              onChange: this.onChange,
              emojiProvider,
              mentionProvider,
              taskDecisionProvider,
              contextIdentifierProvider,
            })}
        <legend>JSON output:</legend>
        {this.renderRenderer(jsonDocument)}
      </Content>
    );
  }
}
