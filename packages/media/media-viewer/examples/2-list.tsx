import * as React from 'react';
import {
  createStorybookContext,
  imageFileId,
  wideImageFileId,
  videoFileId,
  videoHorizontalFileId,
  docFileId,
  defaultCollectionName,
  unknownFileId,
} from '@atlaskit/media-test-helpers';
import { MediaViewer, MediaViewerItem } from '../src/index';
import Button from '@atlaskit/button';

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

const imageIdentifier2: MediaViewerItem = {
  type: 'file',
  id: imageFileId.id,
  occurrenceKey: 'other-ocurrence-key',
};

const videoIdentifier: MediaViewerItem = {
  type: 'file',
  id: videoFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const videoHorizontalFileItem: MediaViewerItem = {
  type: 'file',
  id: videoHorizontalFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const unsupportedIdentifier: MediaViewerItem = {
  type: 'file',
  id: unknownFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export type State = {
  isOpen: boolean;
};
export default class Example extends React.Component<{}, State> {
  state: State = { isOpen: true };

  render() {
    return (
      <div>
        <Button onClick={() => this.setState({ isOpen: true })}>
          Open MediaViewer
        </Button>
        {this.state.isOpen && (
          <MediaViewer
            featureFlags={{ nextGen: true }}
            MediaViewer={null as any}
            basePath={null as any}
            context={context}
            selectedItem={imageIdentifier}
            dataSource={{
              list: [
                videoIdentifier,
                videoHorizontalFileItem,
                imageIdentifier,
                wideImageIdentifier,
                docIdentifier,
                imageIdentifier2,
                unsupportedIdentifier,
              ],
            }}
            collectionName={defaultCollectionName}
            onClose={this.onClose}
          />
        )}
      </div>
    );
  }

  private onClose = () => {
    this.setState({ isOpen: false });
  };
}
