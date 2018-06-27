import * as React from 'react';
import styled from 'styled-components';
import { IntlProvider } from 'react-intl';
import { GlobalQuickSearch } from '../src/index';
import BasicNavigation from '../example-helpers/BasicNavigation';
import { setupMocks, teardownMocks } from '../example-helpers/mockApis';
import { esMessages, frMessages } from '../src/index';

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
    const val = e.target.value;
    let messages = null;

    if (val === 'es') {
      messages = esMessages;
    } else if (val === 'fr') {
      messages = frMessages;
    }

    this.setState({
      messages: messages,
    });
  };

  state = {
    messages: null,
  };

  render() {
    console.log(esMessages);
    return (
      <span>
        <LanguageSelector>
          Select language:
          <Radio
            type="radio"
            id="defaultMessages"
            name="messages"
            value="en"
            onChange={this.handleRadioChange}
          />
          <label for="defaultMessages">Default</label>
          <Radio
            type="radio"
            id="esMessages"
            name="messages"
            value="es"
            onChange={this.handleRadioChange}
          />
          <label for="esMessages">ES</label>
          <Radio
            type="radio"
            id="frMessages"
            name="messages"
            value="fr"
            onChange={this.handleRadioChange}
          />
          <label for="frMessages">FR</label>
        </LanguageSelector>

        <BasicNavigation
          searchDrawerContent={
            <IntlProvider locale="en" messages={this.state.messages}>
              <GlobalQuickSearch cloudId="cloudId" context="confluence" />
            </IntlProvider>
          }
        />
      </span>
    );
  }
}
