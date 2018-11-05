import * as React from 'react';
import { IntlProvider, injectIntl, InjectedIntlProps } from 'react-intl';
import { getMessagesForLocale } from '../util/i18n-util';

export interface Props {
  children: JSX.Element;
}

class MessagesIntlProvider extends React.Component<Props & InjectedIntlProps> {
  render() {
    const { intl, children } = this.props;

    return (
      <IntlProvider messages={getMessagesForLocale(intl.locale)}>
        {children}
      </IntlProvider>
    );
  }
}

export default injectIntl(MessagesIntlProvider);
