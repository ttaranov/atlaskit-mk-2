import * as React from 'react';
import {
  StoryList,
  createStorybookContext,
  collectionNames,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { CardList, CardListEvent } from '../src';
import {
  cardsActions,
  wrongCollection,
  wrongContext,
} from '../example-helpers';

const context = createStorybookContext();
const style = {
  color: 'red',
  fontSize: '30px',
};
const customErrorComponent = <div style={style}>Something went wrong :\</div>;

export default () => (
  <CardList
    context={wrongContext}
    errorComponent={customErrorComponent}
    collectionName={wrongCollection}
    actions={cardsActions}
  />
);
