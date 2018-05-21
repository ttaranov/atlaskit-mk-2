import * as React from 'react';
import { StoryList } from '@atlaskit/media-test-helpers';
import { Context } from '@atlaskit/media-core';

import { CardList } from '../../src';

import { cardsActions } from '..';
import { CardListWrapper } from './styled';

export const renderInfiniteScroll = (
  context: Context,
  collectionName: string,
) => {
  return (
    <StoryList>
      {[
        {
          title: 'With page size of 4',
          content: (
            <CardListWrapper width={400}>
              <CardList
                context={context}
                collectionName={collectionName}
                actions={cardsActions}
                minPageSize={4}
                height={500}
              />
            </CardListWrapper>
          ),
        },
        {
          title: 'With page size of 50',
          content: (
            <CardListWrapper width={400}>
              <CardList
                context={context}
                collectionName={collectionName}
                actions={cardsActions}
                minPageSize={50}
                height={500}
              />
            </CardListWrapper>
          ),
        },
      ]}
    </StoryList>
  );
};
