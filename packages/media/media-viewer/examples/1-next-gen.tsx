import * as React from 'react';
import { MediaViewer } from '../src/index';
import Button from '@atlaskit/button';
import { MediaItemType } from '@atlaskit/media-core';
import {
  createStorybookContext,
  docFileId,
} from '@atlaskit/media-test-helpers';

const context = createStorybookContext();
const selectedItem = {
  type: 'file' as MediaItemType,
  id: docFileId.id,
  occurrenceKey: 'asdasd',
};
const dataSource = {list: [selectedItem]};

export type State = {
  isOpen: boolean;
};

export default class Example extends React.Component<{}, State> {
  state: State = { isOpen: false };

  render() {
    return (
      <div>
        <Button onClick={() => this.setState({ isOpen: true })}>
          Preview an unsupported item
        </Button>
        {this.state.isOpen && (
          <MediaViewer
            featureFlags={{nextGen: true}}
            MediaViewer={null as any}
            basePath={null as any}
            context={context}
            selectedItem={selectedItem}
            dataSource={dataSource}
            collectionName={docFileId.collectionName}
            onClose={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}
