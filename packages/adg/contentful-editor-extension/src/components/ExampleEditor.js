import React from 'react';
import { Editor } from '@atlaskit/editor-core';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import quickInsertProviderFactory, {
  customInsertMenuItems,
} from './EditorExtraMenuItems';
import ImperativeContentfulUIExtension from './ImperativeContentfulUiExtension';
import Test from '../../DESIGN_EXAMPLES';
const quickInsertProvider = quickInsertProviderFactory();

function getTheMatchingComponent(path) {
  return Test.filter(example => example.componentPath === path)[0].component
    .default;
}

export default class Example extends React.PureComponent {
  transformer = new JSONTransformer();

  handleChangeInTheEditor = (editorView, updateContentfulFieldValue) => {
    const adf = this.transformer.encode(editorView.state.doc);
    updateContentfulFieldValue(JSON.parse(JSON.stringify(adf)));
  };

  render() {
    return (
      <div>
        <ImperativeContentfulUIExtension actions={this.props.actions}>
          {({ updateContentfulFieldValue }) => (
            <Editor
              appearance="comment"
              allowTasksAndDecisions={true}
              allowCodeBlocks={true}
              allowLists={true}
              allowRule={true}
              allowTables={true}
              allowExtension
              onChange={editorView =>
                this.handleChangeInTheEditor(
                  editorView,
                  updateContentfulFieldValue,
                )
              }
              insertMenuItems={customInsertMenuItems}
              quickInsert={{ provider: Promise.resolve(quickInsertProvider) }}
              media={{
                allowMediaSingle: true,
              }}
              extensionHandlers={{
                'com.ajay.test': (ext, doc) => {
                  const Tag = getTheMatchingComponent(ext.parameters.tag);
                  return <Tag />;
                },
              }}
            />
          )}
        </ImperativeContentfulUIExtension>
      </div>
    );
  }
}
