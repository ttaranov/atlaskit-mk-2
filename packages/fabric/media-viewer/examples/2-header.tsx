import * as React from 'react';

import {Header} from '../src/newgen/components/header/index';
import {MediaViewerItem, ProcessingStatus} from '../src/newgen/domain'
import {MediaItemType} from '@atlaskit/media-core';

const item: MediaViewerItem = {
  identifier: {id: '1', occurrenceKey: '', mediaItemType: 'file' as MediaItemType},
  processingStatus: ProcessingStatus.Processed
};

export default () => (
  <Header item={item} />
);
