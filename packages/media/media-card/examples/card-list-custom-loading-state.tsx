import * as React from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { CardList } from '../src';
import { cardsActions } from '../example-helpers';

const context = createStorybookContext();
const customLoadingComponent = <div>this is a custom loading...</div>;

export default () => (
  <CardList
    context={context}
    loadingComponent={customLoadingComponent}
    collectionName={defaultCollectionName}
    actions={cardsActions}
  />
);
