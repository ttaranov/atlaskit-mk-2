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
const customLoadingComponent = <div>this is a custom loading...</div>;

export default () => (
  <CardList
    context={context}
    loadingComponent={customLoadingComponent}
    collectionName={defaultCollectionName}
    actions={cardsActions}
  />
);
