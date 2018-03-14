import * as React from 'react';
import { createStorybookContext } from '@atlaskit/media-test-helpers';
import { CardList } from '../src';
import { cardsActions, wrongCollection } from '../example-helpers';

const context = createStorybookContext();
const customEmptyComponent = <div>No items (this is a custom component)</div>;

export default () => (
  <CardList
    context={context}
    emptyComponent={customEmptyComponent}
    collectionName={wrongCollection}
    actions={cardsActions}
  />
);
