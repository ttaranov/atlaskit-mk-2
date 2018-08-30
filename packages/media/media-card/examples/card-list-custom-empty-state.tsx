import * as React from 'react';
import { createStorybookContext } from '@atlaskit/media-test-helpers';
import { IntlProvider } from 'react-intl';
import { CardList } from '../src';
import { cardsActions, wrongCollection } from '../example-helpers';

const context = createStorybookContext();
const customEmptyComponent = <div>No items (this is a custom component)</div>;

export default () => (
  <IntlProvider>
    <CardList
      context={context}
      emptyComponent={customEmptyComponent}
      collectionName={wrongCollection}
      actions={cardsActions}
    />
  </IntlProvider>
);
