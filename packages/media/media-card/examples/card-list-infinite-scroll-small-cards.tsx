import * as React from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { CardList } from '../src';
import { cardsActions } from '../example-helpers';

const context = createStorybookContext();

export default () => (
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
      collectionName={defaultCollectionName}
      actions={cardsActions}
      cardAppearance="small"
      pageSize={20}
      height={500}
    />
  </div>
);
