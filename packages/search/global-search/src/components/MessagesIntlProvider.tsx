import * as React from 'react';
import { IntlProvider, injectIntl, InjectedIntlProps } from 'react-intl';
import { enMessages, esMessages, frMessages } from '../i18n';

const messages = { en: enMessages, es: esMessages, fr: frMessages };

export interface Props {
  children: JSX.Element;
}

// TODO do we have messages for each locale ('en-GB') or each parentLocale? ('en')?
const getMessages = (locale: string) => {
  const parentLocale = locale.split('-')[0];
  return messages[parentLocale];
};

class MessagesIntlProvider extends React.Component<Props & InjectedIntlProps> {
  render() {
    const { intl, children } = this.props;

    return (
      <IntlProvider messages={getMessages(intl.locale)}>
        {children}
      </IntlProvider>
    );
  }
}

export default injectIntl(MessagesIntlProvider);
