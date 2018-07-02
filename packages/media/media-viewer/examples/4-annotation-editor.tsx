import * as React from 'react';
import Button from '@atlaskit/button';
import {
  createUploadContext,
  imageFileId,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { MediaViewer, MediaViewerItem } from '../src/index';

const context = createUploadContext();
const imageItem: MediaViewerItem = {
  type: 'file',
  id: imageFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export type State = {
  selectedItem?: MediaViewerItem;
};

export default class Example extends React.Component<{}, State> {
  state: State = { selectedItem: undefined };
  setItem = (selectedItem: MediaViewerItem) => () => {
    this.setState({ selectedItem });
  };

  render() {
    const { selectedItem } = this.state;

    return (
      <div>
        <Button onClick={this.setItem(imageItem)}>Image item</Button>
        {selectedItem && (
          <MediaViewer
            featureFlags={{ nextGen: true, annotationEditor: true }}
            MediaViewer={null as any}
            basePath={null as any}
            context={context}
            selectedItem={selectedItem}
            dataSource={{ list: [selectedItem] }}
            collectionName={defaultCollectionName}
            onClose={() => this.setState({ selectedItem: undefined })}
          />
        )}
      </div>
    );
  }
}
