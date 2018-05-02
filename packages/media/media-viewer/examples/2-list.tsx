import * as React from 'react';
import {
  createStorybookContext,
  imageFileId,
  wideImageFileId,
  videoFileId,
  docFileId,
  defaultCollectionName,
  unknownFileId,
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

const docIdentifier: MediaViewerItem = {
  type: 'file',
  id: docFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const videoIdentifier: MediaViewerItem = {
  type: 'file',
  id: videoFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const unsupportedIdentifier: MediaViewerItem = {
  type: 'file',
  id: unknownFileId.id,
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
          selectedItem={imageIdentifier}
          dataSource={{
            list: [
              videoIdentifier,
              imageIdentifier,
              wideImageIdentifier,
              docIdentifier,
              unsupportedIdentifier,
            ],
          }}
          collectionName={defaultCollectionName}
        />
      </div>
    );
  }
}
