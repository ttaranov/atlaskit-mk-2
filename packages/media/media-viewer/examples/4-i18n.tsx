import * as React from 'react';
import {
  I18NWrapper,
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { MediaViewer } from '../src';
import { imageItem, errorItem } from '../example-helpers';

const context = createStorybookContext();

export default () => (
  <I18NWrapper>
    <MediaViewer
      featureFlags={{ customVideoPlayer: true }}
      context={context}
      selectedItem={errorItem}
      dataSource={{ list: [imageItem, errorItem] }}
      collectionName={defaultCollectionName}
    />
  </I18NWrapper>
);
