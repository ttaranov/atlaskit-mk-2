import * as React from 'react';
import { Component, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { getMessagesForLocale } from '@atlaskit/media-ui';
import Select from '@atlaskit/select';
import { LocaleSelectorWrapper } from './styled';

export interface I18NWrapperState {
  locale: string;
  children?: ReactNode;
}

export interface I18NWrapperProps {
  initialLocale?: string;
}

const selectOptions = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
];

export class I18NWrapper extends Component<I18NWrapperProps, I18NWrapperState> {
  state: I18NWrapperState = {
    locale: 'en',
  };

  onLocaleChange = (option: any) => {
    this.setState({
      locale: option.value,
    });
  };

  render() {
    const { children } = this.props;
    const { locale } = this.state;
    const messages = getMessagesForLocale(locale);
    console.log(locale, { messages });

    return (
      <IntlProvider locale={locale} messages={messages}>
        <div>
          <LocaleSelectorWrapper>
            <h2>Selected locale: {locale}</h2>
            <Select
              options={selectOptions}
              placeholder="Choose language"
              onChange={this.onLocaleChange}
              defaultValue={selectOptions[0]}
            />
          </LocaleSelectorWrapper>
          {children}
        </div>
      </IntlProvider>
    );
  }
}
