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
        title: 'No parent width',
        content: (
          <div style={{ border: '1px solid', overflow: 'hidden' }}>
            <CardList
              context={context}
              collectionName={defaultCollectionName}
              cardAppearance={'small'}
            />
          </div>
        ),
      },
      {
        title: 'Small parent width',
        content: (
          <div
            style={{ border: '1px solid', width: '50px', overflow: 'hidden' }}
          >
            <CardList
              context={context}
              collectionName={defaultCollectionName}
              cardAppearance={'small'}
            />
          </div>
        ),
      },
      {
        title: 'Large parent width',
        content: (
          <div
            style={{ border: '1px solid', width: '400px', overflow: 'hidden' }}
          >
            <CardList
              context={context}
              collectionName={defaultCollectionName}
              cardAppearance="small"
            />
          </div>
        ),
      },
    ]}
  </StoryList>
);
