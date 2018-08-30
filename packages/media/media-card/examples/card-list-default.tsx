import * as React from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { IntlProvider } from 'react-intl';
import { CardList } from '../src';

const context = createStorybookContext();

export default () => (
  <IntlProvider>
    <CardList context={context} collectionName={defaultCollectionName} />
  </IntlProvider>
);
