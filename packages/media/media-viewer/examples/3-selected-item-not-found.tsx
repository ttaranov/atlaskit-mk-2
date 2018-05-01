import * as React from 'react';
import {
  createStorybookContext,
  imageFileId,
  wideImageFileId,
  videoFileId,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { MediaViewer, MediaViewerItem } from '../src/index';

const context = createStorybookContext();

const imageIdentifier: MediaViewerItem = {
  type: 'file',
  id: imageFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const wideImageIdentifier: MediaViewerItem = {
  type: 'file',
  id: wideImageFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const selectedItem: MediaViewerItem = {
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
          selectedItem={selectedItem}
          dataSource={{
            list: [imageIdentifier, wideImageIdentifier],
          }}
          collectionName={defaultCollectionName}
        />
      </div>
    );
  }
}
