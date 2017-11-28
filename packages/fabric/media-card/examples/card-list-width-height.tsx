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
    cardDimensions={{ width: '200px', height: '100px' }}
    actions={cardsActions}
    pageSize={3}
  />
);
