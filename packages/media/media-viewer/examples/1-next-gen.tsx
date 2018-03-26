import * as React from 'react';
import Button from '@atlaskit/button';
import { MediaItemType } from '@atlaskit/media-core';
import {
  createStorybookContext,
  imageFileId,
  videoFileId,
  defaultCollectionName
} from '@atlaskit/media-test-helpers';
import { MediaViewer, MediaViewerItem } from '../src/index';

const context = createStorybookContext();

const imageItem = {
  type: 'file' as MediaItemType,
  id: imageFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const videoItem = {
  type: 'file' as MediaItemType,
  id: videoFileId.id,
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
          Preview an image item
        </Button>
        <Button onClick={() => this.setState({ selectedItem: videoItem })}>
          Preview a video item
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
