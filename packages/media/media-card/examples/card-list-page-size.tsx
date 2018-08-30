import * as React from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { IntlProvider } from 'react-intl';
import { CardList } from '../src';
import { cardsActions } from '../example-helpers';

const context = createStorybookContext();

export default () => (
  <IntlProvider>
    <CardList
      context={context}
      collectionName={defaultCollectionName}
      actions={cardsActions}
      pageSize={3}
    />
  </IntlProvider>
);
