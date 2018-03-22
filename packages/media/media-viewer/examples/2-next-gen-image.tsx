import * as React from 'react';
import { MediaViewer } from '../src/index';
import { MediaItemType } from '@atlaskit/media-core';
import {
  createStorybookContext,
  imageFileId,
} from '@atlaskit/media-test-helpers';

const context = createStorybookContext();
const selectedItem = {
  type: 'file' as MediaItemType,
  id: imageFileId.id,
  occurrenceKey: 'random-value',
};
const dataSource = {list: [selectedItem]};

export default class Example extends React.Component<{}, {}> {

  render() {
    return (
      <MediaViewer
        featureFlags={{nextGen: true}}
        MediaViewer={null as any}
        basePath={null as any}
        context={context}
        selectedItem={selectedItem}
        dataSource={dataSource}
        collectionName={imageFileId.collectionName}
        onClose={() => this.setState({ isOpen: false })}
      />
    );
  }
}
