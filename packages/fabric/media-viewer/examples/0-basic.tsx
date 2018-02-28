import * as React from 'react';
import { MediaViewer } from '../src/components/media-viewer';
import { MediaItemType } from '@atlaskit/media-core';
import { Card, FileIdentifier } from '@atlaskit/media-card';
import {
  createStorybookContext,
  genericFileId,
} from '@atlaskit/media-test-helpers';

export type BasicExampleState = {
  isOpen: boolean;
};

const context = createStorybookContext();

export default class BasicExample extends React.Component<
  {},
  BasicExampleState
> {
  constructor() {
    super();
    this.state = { isOpen: false };
  }

  render() {
    const selectedItem = {
      id: genericFileId.id,
      occurrenceKey: '',
      type: 'file' as MediaItemType,
    }; // // occurenceKey we can ignore here
    const identifier: FileIdentifier = {
      id: genericFileId.id,
      mediaItemType: 'file',
      collectionName: genericFileId.collectionName,
    };
    const props = {
      context,
      selectedItem,
      dataSource: { list: [selectedItem] },
      collectionName: genericFileId.collectionName, // we need this to get a valid token (because the file is part of a collection)
      MediaViewer: null as any, // we can ignore this one too
      basePath: '', // ignore this here
      experimental: true,
      onClose: () => {
        this.setState({ isOpen: false });
      },
    };
    return (
      <div>
        <p>Click on the image to open Media Viewer:</p>
        <Card
          onClick={() => this.setState({ isOpen: true })}
          context={context}
          identifier={identifier}
        />
        {this.state.isOpen && <MediaViewer {...props} />}
      </div>
    );
  }
}
