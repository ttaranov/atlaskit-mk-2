import * as React from 'react';
import Button from '@atlaskit/button';
import { MediaViewer } from '../src/components/media-viewer';
import { MediaItemType } from '@atlaskit/media-core';
import {
  createStorybookContext,
  genericFileId,
} from '@atlaskit/media-test-helpers';

export type BasicExampleState = {
  isOpen: boolean;
};

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
    const props = {
      context: createStorybookContext(),
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
        <p>
          <Button onClick={() => this.setState({ isOpen: true })}>
            Open experimental Media Viewer
          </Button>
        </p>

        {this.state.isOpen && <MediaViewer {...props} />}
      </div>
    );
  }
}
