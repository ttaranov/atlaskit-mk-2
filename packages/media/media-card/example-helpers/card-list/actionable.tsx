import * as React from 'react';
import { StoryList } from '@atlaskit/media-test-helpers';
import { Context } from '@atlaskit/media-core';

import { CardList, CardListEvent } from '../../src';

import { cardsActions } from '..';

const cardClickHandler = (result: CardListEvent) => {
  result.event.preventDefault();
  console.log('click', [result.mediaCollectionItem, result.collectionName]);
};

export const renderActionableLists = (
  context: Context,
  collectionName: string,
) => {
  return (
    <StoryList>
      {[
        {
          title: 'Actions',
          content: (
            <CardList
              context={context}
              collectionName={collectionName}
              actions={cardsActions}
            />
          ),
        },
        {
          title: 'onCardClick',
          content: (
            <CardList
              context={context}
              collectionName={collectionName}
              onCardClick={cardClickHandler}
            />
          ),
        },
      ]}
    </StoryList>
  );
};
