import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { messages } from './i18n';

export default (id: string): JSX.Element => {
  return <FormattedMessage id={id} defaultMessage={(messages as any)[id]} />;
};
