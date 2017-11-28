import * as React from 'react';
import {
  StoryList,
  createStorybookContext,
  collectionNames,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { CardList, CardListEvent } from '../src';
import { cardsActions } from '../example-helpers';

const context = createStorybookContext();

export default () => (
  <CardList
    context={context}
    collectionName={defaultCollectionName}
    actions={cardsActions}
    pageSize={10}
    height={500}
  />
);
