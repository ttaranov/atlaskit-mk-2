import * as React from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import * as frLocaleData from 'react-intl/locale-data/fr';

import FullPageEditor from './5-full-page';

addLocaleData(frLocaleData);

export default function Example({ defaultValue }) {
  return (
    <IntlProvider locale="fr">
      <FullPageEditor defaultValue={''} />
    </IntlProvider>
  );
}
