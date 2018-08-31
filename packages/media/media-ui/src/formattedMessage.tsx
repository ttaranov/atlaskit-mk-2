import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { getMessagesForLocale } from './i18n';

export default (id: string): JSX.Element => {
  const messages = getMessagesForLocale();

  return <FormattedMessage id={id} defaultMessage={messages[id]} />;
};
