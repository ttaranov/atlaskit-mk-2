import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { CardList } from '../src';
import {
  cardsActions,
  wrongCollection,
  wrongContext,
} from '../example-helpers';

const style = {
  color: 'red',
  fontSize: '30px',
};
const customErrorComponent = <div style={style}>Something went wrong :\</div>;

export default () => (
  <IntlProvider>
    <CardList
      context={wrongContext}
      errorComponent={customErrorComponent}
      collectionName={wrongCollection}
      actions={cardsActions}
    />
  </IntlProvider>
);
