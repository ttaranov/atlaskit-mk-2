import * as React from 'react';
import { StoryList } from '@atlaskit/media-test-helpers';
import { Context } from '@atlaskit/media-core';

import { CardList } from '../../src';

import { cardsActions } from '..';

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
            <div
              style={{
                display: 'inline-block',
                width: '300px',
                background: 'white',
                border: '2px solid',
              }}
            >
              <CardList
                context={context}
                collectionName={collectionName}
                actions={cardsActions}
                pageSize={20}
                height={500}
              />
            </div>
          ),
        },
      ]}
    </StoryList>
  );
};
