import * as React from 'react';
import {
  StoryList,
  createStorybookContext,
  defaultCollectionName,
  emptyCollectionName,
} from '@atlaskit/media-test-helpers';

import {
  cardsActions,
  wrongCollection,
  wrongContext,
} from '../example-helpers';

import { CardList } from '../src';

const context = createStorybookContext();

const renderVariousWidths = () => {
  return (
    <StoryList>
      {[
        {
          title: 'Small parent width',
          content: (
            <div
              style={{ border: '1px solid', width: '50px', overflow: 'hidden' }}
            >
              <CardList
                context={context}
                collectionName={defaultCollectionName}
              />
            </div>
          ),
        },
        {
          title: 'No parent width',
          content: (
            <div style={{ border: '1px solid', overflow: 'hidden' }}>
              <CardList
                context={context}
                collectionName={defaultCollectionName}
              />
            </div>
          ),
        },
        {
          title: 'Large parent width',
          content: (
            <div
              style={{
                border: '1px solid',
                width: '400px',
                overflow: 'hidden',
              }}
            >
              <CardList
                context={context}
                collectionName={defaultCollectionName}
              />
            </div>
          ),
        },
      ]}
    </StoryList>
  );
};

const renderEmptyStates = () => {
  const customEmptyComponent = <div>No items (this is a custom component)</div>;

  return (
    <StoryList>
      {[
        {
          title: 'Default empty state',
          content: (
            <CardList context={context} collectionName={emptyCollectionName} />
          ),
        },
        {
          title: 'Custom empty state',
          content: (
            <CardList
              context={context}
              emptyComponent={customEmptyComponent}
              collectionName={emptyCollectionName}
            />
          ),
        },
      ]}
    </StoryList>
  );
};

const renderErrorState = () => {
  const style = { color: 'red', fontSize: '30px' };
  const customErrorComponent = <div style={style}>Something went wrong :\</div>;

  return (
    <StoryList>
      {[
        {
          title: 'Default error state',
          content: (
            <CardList
              context={wrongContext}
              collectionName={wrongCollection}
              actions={cardsActions}
            />
          ),
        },
        {
          title: 'Custom error state',
          content: (
            <CardList
              context={wrongContext}
              errorComponent={customErrorComponent}
              collectionName={wrongCollection}
              actions={cardsActions}
            />
          ),
        },
      ]}
    </StoryList>
  );
};

export default () => (
  <div>
    <h2>Custom widths</h2>
    {renderVariousWidths()}

    <h2>Empty state</h2>
    {renderEmptyStates()}

    <h2>Error state</h2>
    {renderErrorState()}
  </div>
);
