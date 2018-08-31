import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { getMessagesForLocale } from './i18n';
import { mediaLocalePrefix } from './i18n/prefixMessages';

export default (id: string): JSX.Element => {
  const mediaId = `${mediaLocalePrefix}.${id}`;
  const messages = getMessagesForLocale();

  return <FormattedMessage id={mediaId} defaultMessage={messages[mediaId]} />;
};
