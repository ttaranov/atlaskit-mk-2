import * as React from 'react';
import { StoryList } from '@atlaskit/media-test-helpers';
import { Context } from '@atlaskit/media-core';

import { CardList, CardListEvent } from '../../src';

import { cardsActions } from '..';
import { CardListWrapper } from './styled';

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
            <CardListWrapper>
              <CardList
                context={context}
                collectionName={collectionName}
                actions={cardsActions}
              />
            </CardListWrapper>
          ),
        },
        {
          title: 'onCardClick',
          content: (
            <CardListWrapper>
              <CardList
                context={context}
                collectionName={collectionName}
                onCardClick={cardClickHandler}
              />
            </CardListWrapper>
          ),
        },
      ]}
    </StoryList>
  );
};
