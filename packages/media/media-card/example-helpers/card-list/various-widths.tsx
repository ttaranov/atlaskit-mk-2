import * as React from 'react';
import { StoryList } from '@atlaskit/media-test-helpers';
import { Context } from '@atlaskit/media-core';

import { CardList } from '../../src';

import { CardListWrapper } from './styled';

export const renderVariousWidths = (
  context: Context,
  collectionName: string,
) => {
  return (
    <StoryList>
      {[
        {
          title: 'Small parent width',
          content: (
            <CardListWrapper width={50}>
              <CardList
                context={context}
                collectionName={collectionName}
                minPageSize={10}
              />
            </CardListWrapper>
          ),
        },
        {
          title: 'No parent width',
          content: (
            <CardListWrapper>
              <CardList
                context={context}
                collectionName={collectionName}
                minPageSize={10}
              />
            </CardListWrapper>
          ),
        },
        {
          title: 'Large parent width',
          content: (
            <CardListWrapper width={400}>
              <CardList
                context={context}
                collectionName={collectionName}
                minPageSize={10}
              />
            </CardListWrapper>
          ),
        },
      ]}
    </StoryList>
  );
};
