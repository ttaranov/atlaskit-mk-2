/* tslint:disable:no-console */

import * as React from 'react';
import {
  StoryList,
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { CardList, CardListEvent } from '../src';
import { cardsActions } from '../example-helpers';

const context = createStorybookContext();

const cardClickHandler = (result: CardListEvent) => {
  result.event.preventDefault();
  console.log('click', [result.mediaCollectionItem, result.collectionName]);
};

const cardLists = [
  {
    title: 'Actions',
    content: (
      <CardList
        context={context}
        collectionName={defaultCollectionName}
        actions={cardsActions}
      />
    ),
  },
  {
    title: 'onCardClick',
    content: (
      <CardList
        context={context}
        collectionName={defaultCollectionName}
        onCardClick={cardClickHandler}
      />
    ),
  },
];

export default () => (
  <div style={{ margin: '40px' }}>
    <StoryList>{cardLists}</StoryList>
  </div>
);
