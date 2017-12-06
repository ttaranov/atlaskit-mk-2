import * as React from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { CardList } from '../src';

const context = createStorybookContext();

export default () => (
  <CardList
    context={context}
    collectionName={defaultCollectionName}
    shouldLazyLoadCards={false}
  />
);
