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
import examples from '../../test';
import Avatar1 from '../../../../../packages/core/avatar';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';

function getExampleComponent(key) {
  return require(examples.filter(example => example.key === key)[0].component)
    .default;
}

export default class Example extends React.PureComponent {
  state = { adf: {} };
  transformer = new JSONTransformer();

  handleChangeInTheEditor = editorView => {
    const adf = this.transformer.encode(editorView.state.doc);

    this.setState({ adf });
  };

  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.state.adf, null, 2)}</pre>
        <Editor
          appearance="comment"
          allowTasksAndDecisions={true}
          allowCodeBlocks={true}
          allowLists={true}
          allowRule={true}
          allowTables={true}
          allowExtension
          onChange={this.handleChangeInTheEditor}
          insertMenuItems={customInsertMenuItems}
          media={{
            allowMediaSingle: true,
          }}
          extensionHandlers={{
            'com.ajay.test': (ext, doc) => {
              const Tag = getExampleComponent(ext.parameters.tag);

              console.log(Tag);
              console.log(ext.parameters.tag);
              return <Tag />;
            },
          }}
        />
      </div>
    );
  }
}
