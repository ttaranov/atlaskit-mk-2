import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { defaultMessages } from './i18n';
import { mediaLocalePrefix } from './i18n/prefixMessages';

export default (id: string): JSX.Element => {
  const mediaId = `${mediaLocalePrefix}.${id}`;

  return (
    <FormattedMessage id={mediaId} defaultMessage={defaultMessages[mediaId]} />
  );
};
