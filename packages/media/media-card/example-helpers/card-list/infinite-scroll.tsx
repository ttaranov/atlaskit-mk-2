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
          title: 'Infinite scoll',
          content: (
            <CardListWrapper width={450}>
              <CardList
                context={context}
                collectionName={collectionName}
                actions={cardsActions}
                pageSize={4}
                height={500}
              />
            </CardListWrapper>
          ),
        },
      ]}
    </StoryList>
  );
};
