import * as React from 'react';

import {Footer} from '../src/newgen/components/footer/';
import {MediaViewerItem, ProcessingStatus} from '../src/newgen/domain'
import {MediaItemType} from '@atlaskit/media-core';

const item: MediaViewerItem = {
  identifier: {id: '1', occurrenceKey: '', mediaItemType: 'file' as MediaItemType},
  processingStatus: ProcessingStatus.Processed
};

export default () => (
  <Footer item={item} />
);
