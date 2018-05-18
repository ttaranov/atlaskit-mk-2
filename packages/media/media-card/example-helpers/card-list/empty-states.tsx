import * as React from 'react';
import { Component } from 'react';
import { StoryList } from '@atlaskit/media-test-helpers';
import { Context } from '@atlaskit/media-core';

import { CardList } from '../../src';

import { CardListWrapper } from './styled';

export const renderEmptyStates = (context: Context, collectionName: string) => {
  const customEmptyComponent = <div>No items (this is a custom component)</div>;

  return (
    <StoryList>
      {[
        {
          title: 'Default empty state',
          content: (
            <CardList context={context} collectionName={collectionName} />
          ),
        },
        {
          title: 'Custom empty state',
          content: (
            <CardList
              context={context}
              emptyComponent={customEmptyComponent}
              collectionName={collectionName}
            />
          ),
        },
      ]}
    </StoryList>
  );
};
