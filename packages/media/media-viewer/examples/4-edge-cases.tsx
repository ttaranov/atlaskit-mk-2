import * as React from 'react';
import {
  createStorybookContext,
  imageFileId,
  wideImageFileId,
  videoFileId,
  videoProcessingFailedId,
  defaultCollectionName,
  genericLinkId,
} from '@atlaskit/media-test-helpers';
import { MediaViewer, MediaViewerItem } from '../src/index';
import Button from '@atlaskit/button';
import { MediaViewerDataSource } from '../';

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

const invalidItem: MediaViewerItem = {
  type: 'file',
  id: 'invalid-id',
  occurrenceKey: 'invalid-key',
};

const itemProcessingFailed: MediaViewerItem = {
  type: 'file',
  id: videoProcessingFailedId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const linkItem: MediaViewerItem = {
  type: 'link',
  id: genericLinkId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export type State = {
  selectedItem?: MediaViewerItem;
  dataSource?: MediaViewerDataSource;
};

export default class Example extends React.Component<{}, State> {
  state: State = {};

  render() {
    return (
      <div>
        <Button
          onClick={() =>
            this.setState({
              selectedItem,
              dataSource: { list: [imageIdentifier, wideImageIdentifier] },
            })
          }
        >
          Selected item not found in the list
        </Button>

        <Button
          onClick={() =>
            this.setState({
              selectedItem: invalidItem,
              dataSource: { list: [invalidItem] },
            })
          }
        >
          Invalid ID
        </Button>

        <Button
          onClick={() =>
            this.setState({
              selectedItem: itemProcessingFailed,
              dataSource: { list: [itemProcessingFailed] },
            })
          }
        >
          Video processing failed
        </Button>

        <Button
          onClick={() =>
            this.setState({
              selectedItem: itemProcessingFailed,
              dataSource: { collectionName: 'invalid-name' },
            })
          }
        >
          Collection failed to load
        </Button>

        <Button
          onClick={() =>
            this.setState({
              selectedItem: linkItem,
              dataSource: { list: [linkItem] },
            })
          }
        >
          Links are not supported
        </Button>

        {this.state.selectedItem &&
          this.state.dataSource &&
          this.renderMV(this.state.selectedItem, this.state.dataSource)}
      </div>
    );
  }

  private renderMV(
    selectedItem: MediaViewerItem,
    dataSource: MediaViewerDataSource,
  ) {
    return (
      <MediaViewer
        featureFlags={{ nextGen: true }}
        MediaViewer={null as any}
        basePath={null as any}
        context={context}
        selectedItem={selectedItem}
        dataSource={dataSource}
        collectionName={defaultCollectionName}
        onClose={this.onClose}
      />
    );
  }

  private onClose = () => {
    this.setState({ selectedItem: undefined, dataSource: undefined });
  };
}
