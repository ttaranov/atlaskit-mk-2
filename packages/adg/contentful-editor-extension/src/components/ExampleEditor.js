import React from 'react';
import { Editor } from '@atlaskit/editor-core';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import quickInsertProviderFactory, {
  customInsertMenuItems,
} from './EditorExtraMenuItems';

const quickInsertProvider = quickInsertProviderFactory();

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
          quickInsert={{ provider: Promise.resolve(quickInsertProvider) }}
          media={{
            allowMediaSingle: true,
          }}
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
