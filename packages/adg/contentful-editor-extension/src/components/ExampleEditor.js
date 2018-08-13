import React from 'react';
import { Editor } from '@atlaskit/editor-core';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import quickInsertProviderFactory, {
  customInsertMenuItems,
} from './EditorExtraMenuItems';
import ImperativeContentfulUIExtension from './ImperativeContentfulUiExtension';
import Loadable from 'react-loadable';
import * as fs from '../utils/fs';
import packageResolver from '../utils/packageResolver';

import { providers } from './stuffIDontUnderstand';

const quickInsertProvider = quickInsertProviderFactory();

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
              allowGapCursor={true}
              allowTables={true}
              allowExtension
              onChange={editorView =>
                this.handleChangeInTheEditor(
                  editorView,
                  updateContentfulFieldValue,
                )
              }
              quickInsert={{ provider: Promise.resolve(quickInsertProvider) }}
              media={{
                provider: providers.mediaProvider.resolved,
                allowMediaSingle: true,
              }}
              extensionHandlers={{
                'com.ajay.test': (ext, doc) => {
                  const { extensionKey, parameters } = ext;
                  const { componentPath } = parameters;
                  const [
                    ,
                    groupId,
                    packageName,
                    ,
                    ,
                    exampleName,
                  ] = componentPath.split('/');

                  const { examples, packageId, exampleId } = packageResolver(
                    groupId,
                    packageName,
                    exampleName,
                  );

                  const LoadableComponent = Loadable({
                    loader: () =>
                      fs
                        .getById(fs.getFiles(examples.children), exampleName)
                        .exports(),
                    loading: () => <div>something</div>,
                    render(loaded) {
                      if (!loaded.default) {
                        return <div>Example doesn't have default export.</div>;
                      }

                      return (
                        <div>
                          <loaded.default />
                        </div>
                      );
                    },
                  });
                  return <LoadableComponent />;
                },
              }}
            />
          )}
        </ImperativeContentfulUIExtension>
      </div>
    );
  }
}
