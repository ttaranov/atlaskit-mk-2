import * as React from 'react';
import Button from '@atlaskit/button';
import {
  createStorybookContext,
  imageFileId,
  audioFileId,
  videoFileId,
  docFileId,
  defaultCollectionName,
  unknownFileId,
  audioNoCoverFileId,
  videoHorizontalFileId,
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

  render() {
    return (
      <div>
        <Button onClick={() => this.setState({ selectedItem: imageItem })}>
          Image item
        </Button>
        <Button
          onClick={() =>
            this.setState({ selectedItem: videoHorizontalFileItem })
          }
        >
          Video horizontal
        </Button>
        <Button onClick={() => this.setState({ selectedItem: videoItem })}>
          Video vertical
        </Button>
        <Button onClick={() => this.setState({ selectedItem: audioItem })}>
          Audio item
        </Button>
        <Button
          onClick={() => this.setState({ selectedItem: audioItemNoCover })}
        >
          Audio no cover
        </Button>
        <Button onClick={() => this.setState({ selectedItem: docItem })}>
          Doc item
        </Button>
        <Button
          onClick={() => this.setState({ selectedItem: unsupportedItem })}
        >
          Unsupported item
        </Button>

        {this.state.selectedItem && (
          <MediaViewer
            featureFlags={{ nextGen: true }}
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
