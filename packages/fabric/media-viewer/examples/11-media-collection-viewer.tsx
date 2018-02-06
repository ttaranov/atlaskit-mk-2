import * as React from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';

import { MediaViewerRenderer } from '../src/newgen/components/mediaviewer';
import { MediaItemIdentifier } from '../src/newgen/domain';
import { MediaItemType } from '@atlaskit/media-core';
import { MockWithCollection } from '../example-helpers/with-collection1';

const context = createStorybookContext() as any;
const dataSource = {
  collectionName: defaultCollectionName,
};

const mockWithCollection = ({ children, selectedItemId }) => (
  <MockWithCollection
    context={context}
    selectedItemId={selectedItemId}
    dataSource={dataSource}
  >
    {children}
  </MockWithCollection>
);

const selectedItemId: MediaItemIdentifier = {
  id: '2',
  occurrenceKey: '',
  mediaItemType: 'file' as MediaItemType,
};

export default () => (
  <MediaViewerRenderer
    selectedItemId={selectedItemId}
    DataComponent={mockWithCollection}
  />
);
