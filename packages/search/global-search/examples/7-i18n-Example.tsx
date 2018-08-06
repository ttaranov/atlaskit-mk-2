import * as React from 'react';
import styled from 'styled-components';
import { GlobalQuickSearch } from '../src/index';
import BasicNavigation from '../example-helpers/BasicNavigation';
import { setupMocks, teardownMocks } from '../example-helpers/mockApis';
import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';

const LanguageSelector = styled.div`
  position: absolute;
  z-index: 1000;
`;

const Radio = styled.input`
  margin-left: 16px;
  margin-right: 8px;
`;

export default class extends React.Component {
  componentWillMount() {
    setupMocks();
  }

  componentWillUnmount() {
    teardownMocks();
  }

  handleRadioChange = e => {
    this.setState({
      locale: e.target.value,
    });
  };

  state = {
    locale: 'en',
  };

  render() {
    return (
      <span>
        <LanguageSelector>
          Select language:
          <Radio
            type="radio"
            id="defaultLocale"
            name="locale"
            value="en"
            onChange={this.handleRadioChange}
          />
          <label htmlFor="defaultLocale">Default</label>
          <Radio
            type="radio"
            id="esLocale"
            name="locale"
            value="es"
            onChange={this.handleRadioChange}
          />
          <label htmlFor="esLocale">ES</label>
          <Radio
            type="radio"
            id="frLocale"
            name="locale"
            value="fr"
            onChange={this.handleRadioChange}
          />
          <label htmlFor="frLocale">FR</label>
          <Radio
            type="radio"
            id="ptBRLocale"
            name="locale"
            value="pt-BR"
            onChange={this.handleRadioChange}
          />
          <label htmlFor="ptBRLocale">pt-BR</label>
          <Radio
            type="radio"
            id="zhLocale"
            name="locale"
            value="zh"
            onChange={this.handleRadioChange}
          />
          <label htmlFor="zhLocale">ZH</label>
        </LanguageSelector>

        <BasicNavigation
          searchDrawerContent={
            <LocaleIntlProvider locale={this.state.locale}>
              <GlobalQuickSearch cloudId="cloudId" context="confluence" />
            </LocaleIntlProvider>
          }
        />
      </span>
    );
  }
}
