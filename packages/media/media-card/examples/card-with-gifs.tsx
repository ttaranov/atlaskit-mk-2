import * as React from 'react';
import {
  onlyAnimatedGifsCollectionName,
  createStorybookContext,
} from '@atlaskit/media-test-helpers';
import { CardList } from '../src';
import { cardsActions } from '../example-helpers';

const context = createStorybookContext();

export default () => (
  <div
    style={{
      display: 'flex',
      margin: 10,
    }}
  >
    <div
      style={{
        display: 'inline-block',
        width: '300px',
        background: 'white',
        border: '1px dotted',
        marginRight: 10,
        padding: 5,
      }}
    >
      <h2>Small Cards</h2>
      <CardList
        context={context}
        collectionName={onlyAnimatedGifsCollectionName}
        actions={cardsActions}
        cardAppearance="small"
        pageSize={20}
        height={500}
      />
    </div>
    <div
      style={{
        display: 'inline-block',
        width: '300px',
        background: 'white',
        border: '1px dotted',
        padding: 5,
      }}
    >
      <h2>Normal Cards</h2>
      <CardList
        context={context}
        collectionName={onlyAnimatedGifsCollectionName}
        actions={cardsActions}
        pageSize={20}
        height={500}
      />
    </div>
  </div>
);
