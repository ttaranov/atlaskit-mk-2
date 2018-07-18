import React from 'react';
import {
  Editor,
  EditorContext,
  WithEditorActions,
} from '@atlaskit/editor-core';
import Avatar from '@atlaskit/avatar';
import { customInsertMenuItems } from './EditorExtraMenuItems';
import MarkdownTransformer from '../utils/markdownTransformer';
import { ConfluenceTransformer } from '@atlaskit/editor-confluence-transformer';

export default class Example extends React.PureComponent {
  state = { src: '' };

  componentDidMount() {
    setTimeout(() => {
      this.props.actions.replaceDocument(this.state.src);
    });
  }

  handleUpdateToSource = e => {
    const value = e.currentTarget.innerText;
    this.setState({ src: value }, () =>
      this.props.actions.replaceDocument(value),
    );
  };

  textUpdated = () => {
    const adf = this.props.actions.getValue().then(val =>
      this.setState({
        src: val,
      }),
    );
  };

  render() {
    return (
      <div>
        <div>{this.state.src}</div>
        <Editor
          appearance="comment"
          allowTasksAndDecisions={true}
          allowCodeBlocks={true}
          allowLists={true}
          allowRule={true}
          allowTables={true}
          allowExtension
          onChange={this.textUpdated}
          insertMenuItems={customInsertMenuItems}
          media={{
            allowMediaSingle: true,
          }}
          contentTransformerProvider={schema =>
            new ConfluenceTransformer(schema)
          }
          extensionHandlers={{
            'com.ajay.test': (ext, doc) => {
              const Tag = ext.parameters.tag;
              return <Tag />;
            },
          }}
        />
      </div>
    );
  }
}
