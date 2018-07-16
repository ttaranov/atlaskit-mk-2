import * as React from 'react';
import Button from '@atlaskit/button';
import {
  createStorybookContext,
  imageFileId,
  audioFileId,
  videoFileId,
  docFileId,
  defaultCollectionName,
  archiveFileId,
  unknownFileId,
  audioNoCoverFileId,
  videoHorizontalFileId,
  videoLargeFileId,
  videoProcessingFailedId,
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

const videoHorizontalFileItem: MediaViewerItem = {
  type: 'file',
  id: videoHorizontalFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const videoLargeFileItem: MediaViewerItem = {
  type: 'file',
  id: videoLargeFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const videoProcessingFailedItem: MediaViewerItem = {
  type: 'file',
  id: videoProcessingFailedId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const audioItem: MediaViewerItem = {
  type: 'file',
  id: audioFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const audioItemNoCover: MediaViewerItem = {
  type: 'file',
  id: audioNoCoverFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const archiveItem: MediaViewerItem = {
  type: 'file',
  id: archiveFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const unsupportedItem: MediaViewerItem = {
  type: 'file',
  id: unknownFileId.id,
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
    return (
      <div>
        <Button onClick={this.setItem(imageItem)}>Image item</Button>
        <Button onClick={this.setItem(videoHorizontalFileItem)}>
          Video horizontal
        </Button>
        <Button onClick={this.setItem(videoLargeFileItem)}>Video large</Button>
        <Button onClick={this.setItem(videoItem)}>Video vertical</Button>
        <Button onClick={this.setItem(videoProcessingFailedItem)}>
          Failed video processing
        </Button>
        <Button onClick={this.setItem(audioItem)}>Audio item</Button>
        <Button onClick={this.setItem(audioItemNoCover)}>Audio no cover</Button>
        <Button onClick={this.setItem(docItem)}>Doc item</Button>
        <Button onClick={this.setItem(archiveItem)}>Archive</Button>
        <Button onClick={this.setItem(unsupportedItem)}>
          Unsupported item
        </Button>

        {this.state.selectedItem && (
          <MediaViewer
            featureFlags={{ nextGen: true, customVideoPlayer: true }}
            MediaViewer={null as any}
            basePath={null as any}
            context={context}
            selectedItem={this.state.selectedItem}
            dataSource={{ list: [this.state.selectedItem] }}
            collectionName={defaultCollectionName}
            onClose={() => this.setState({ selectedItem: undefined })}
          />
        )}
      </div>
    );
  }
}
