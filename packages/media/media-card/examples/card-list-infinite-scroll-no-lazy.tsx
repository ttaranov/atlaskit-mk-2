import * as React from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { CardList } from '../src';
import { cardsActions } from '../example-helpers';
const context = createStorybookContext();

export default () => (
  <CardList
    context={context}
    collectionName={defaultCollectionName}
    actions={cardsActions}
    pageSize={10}
    height={500}
    shouldLazyLoadCards={false}
  />
);
