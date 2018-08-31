import * as React from 'react';
import { Component, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { getMessagesForLocale } from '@atlaskit/media-ui';

export interface I18NWrapperState {
  locale: string;
  children?: ReactNode;
}

export class I18NWrapper extends Component<{}, I18NWrapperState> {
  state: I18NWrapperState = {
    locale: 'en',
  };

  render() {
    const { children } = this.props;
    const { locale } = this.state;
    const messages = getMessagesForLocale(locale);
    console.log(locale, { messages });

    return (
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    );
  }
}
