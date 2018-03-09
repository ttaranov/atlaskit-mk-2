import * as React from 'react';
import {
  StoryList,
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { CardList } from '../src';

const context = createStorybookContext();

export default () => (
  <StoryList>
    {[
      {
        title: 'Normal card',
        content: (
          <CardList
            context={context}
            collectionName={defaultCollectionName}
            pageSize={30}
          />
        ),
      },
      {
        title: 'Small card',
        content: (
          <CardList
            context={context}
            collectionName={defaultCollectionName}
            pageSize={30}
            cardAppearance={'small'}
          />
        ),
      },
      {
        title: 'Small card',
        content: (
          <CardList
            context={context}
            collectionName={defaultCollectionName}
            pageSize={30}
            cardAppearance={'small'}
          />
        ),
      },
      {
        title: 'Normal Card',
        content: (
          <CardList
            context={context}
            collectionName={defaultCollectionName}
            pageSize={30}
          />
        ),
      },
      {
        title: 'Normal card',
        content: (
          <CardList
            context={context}
            collectionName={defaultCollectionName}
            pageSize={30}
          />
        ),
      },
      {
        title: 'Normal card',
        content: (
          <CardList
            context={context}
            collectionName={defaultCollectionName}
            pageSize={30}
          />
        ),
      },
    ]}
  </StoryList>
);
