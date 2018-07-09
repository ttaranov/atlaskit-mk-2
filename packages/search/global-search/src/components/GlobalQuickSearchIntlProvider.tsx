import * as React from 'react';

import { IntlProvider, injectIntl, InjectedIntlProps } from 'react-intl';

import { enMessages, esMessages, frMessages } from '../i18n';
const messages = { en: enMessages, es: esMessages, fr: frMessages };

export interface Props {
  children: JSX.Element;
}

class GlobalQuickSearchIntlProvider extends React.Component<
  Props & InjectedIntlProps
> {
  render() {
    const { intl, children } = this.props;

    return (
      <IntlProvider messages={messages[intl.locale]}>{children}</IntlProvider>
    );
  }
}

export default injectIntl(GlobalQuickSearchIntlProvider);
