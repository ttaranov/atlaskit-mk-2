import * as React from 'react';
import {createStorybookContext, defaultCollectionName} from '@atlaskit/media-test-helpers';

import {MediaViewer as NewMediaViewer} from '../src/newgen';
import {MediaItemIdentifier} from '../src/newgen/domain'
import {MediaItemType} from '@atlaskit/media-core';

const context = createStorybookContext() as any;

const dataSource = {
  collectionName: defaultCollectionName
}

const selectedItem: MediaItemIdentifier = {
  id: '2',
  occurrenceKey: '',
  mediaItemType: 'file' as MediaItemType
};

export default () => (
  <NewMediaViewer
    context={context}
    dataSource={dataSource}
    selectedItemId={selectedItem}
  />
);