import * as React from 'react';
import {
  StoryList,
  createStorybookContext,
  collectionNames,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { CardList, CardListEvent } from '../src';
import { cardsActions, wrongCollection } from '../example-helpers';

const context = createStorybookContext();
const customEmptyComponent = <div>No items (this is a custom component)</div>;

export default () => (
  <CardList
    context={context}
    emptyComponent={customEmptyComponent}
    collectionName={wrongCollection}
    actions={cardsActions}
  />
);
