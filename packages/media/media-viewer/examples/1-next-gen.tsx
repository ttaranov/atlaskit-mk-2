import * as React from 'react';
import Button from '@atlaskit/button';
import { MediaItemType } from '@atlaskit/media-core';
import {
  createStorybookContext,
  imageFileId,
} from '@atlaskit/media-test-helpers';
import { MediaViewer } from '../src/index';

const context = createStorybookContext();
const selectedItem = {
  type: 'file' as MediaItemType,
  id: imageFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};
const dataSource = { list: [selectedItem] };

export type State = {
  isOpen: boolean;
};

export default class Example extends React.Component<{}, State> {
  state: State = { isOpen: false };

  render() {
    return (
      <div>
        <Button onClick={() => this.setState({ isOpen: true })}>
          Preview an image item
        </Button>
        {this.state.isOpen && (
          <MediaViewer
            featureFlags={{ nextGen: true }}
            MediaViewer={null as any}
            basePath={null as any}
            context={context}
            selectedItem={selectedItem}
            dataSource={dataSource}
            collectionName={imageFileId.collectionName}
            onClose={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}
