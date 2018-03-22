import * as React from 'react';
import Button from '@atlaskit/button';
import { MediaItemType } from '@atlaskit/media-core';
import {
  createStorybookContext,
  docFileId,
  imageFileId
} from '@atlaskit/media-test-helpers';
import { MediaViewer, MediaViewerItem } from '../src/index';

const context = createStorybookContext();

const doc = {
  type: 'file' as MediaItemType,
  id: docFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

const image = {
  type: 'file' as MediaItemType,
  id: imageFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export type State = {
  openItem?: MediaViewerItem
};

export default class Example extends React.Component<{}, State> {
  state: State = { openItem: undefined };

  render() {
    return (
      <div>
        <Button onClick={() => this.setState({ openItem: doc })}>
          Preview an unsupported item
        </Button>
        <Button onClick={() => this.setState({ openItem: image })}>
          Preview an image
        </Button>
        {this.state.openItem && (
          <MediaViewer
            featureFlags={{ nextGen: true }}
            MediaViewer={null as any}
            basePath={null as any}
            context={context}
            selectedItem={this.state.openItem}
            dataSource={{ list: [this.state.openItem] }}
            collectionName={docFileId.collectionName}
            onClose={() => this.setState({ openItem: undefined })}
          />
        )}
      </div>
    );
  }
}
