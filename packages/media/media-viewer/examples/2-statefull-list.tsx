import * as React from 'react';
import {
  createStorybookContext,
  imageFileId,
  videoFileId,
  docFileId,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { MediaViewer, MediaViewerItem } from '../src/index';

const context = createStorybookContext();

const imageItem: MediaViewerItem = {
  type: 'file',
  id: imageFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const docItem: MediaViewerItem = {
  type: 'file',
  id: docFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const videoItem: MediaViewerItem = {
  type: 'file',
  id: videoFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export default class Example extends React.Component<{}, {}> {

  render() {
    return (
      <div>
        <MediaViewer
          featureFlags={{ nextGen: true }}
          MediaViewer={null as any}
          basePath={null as any}
          context={context}
          selectedItem={imageItem}
          dataSource={{ list: [imageItem, videoItem, docItem] }}
          collectionName={defaultCollectionName}
          onClose={() => this.setState({ selectedItem: undefined })}
        />
      </div>
    );
  }
}
