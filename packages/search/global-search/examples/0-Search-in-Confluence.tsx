import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { GlobalQuickSearch } from '../src/index';
import BasicNavigation from '../example-helpers/BasicNavigation';
import { setupMocks, teardownMocks } from '../example-helpers/mockApis';

export default class extends React.Component {
  componentWillMount() {
    setupMocks();
  }

  componentWillUnmount() {
    teardownMocks();
  }

  render() {
    return (
      <BasicNavigation
        searchDrawerContent={
          <IntlProvider locale="en">
            <GlobalQuickSearch cloudId="cloudId" context="confluence" />
          </IntlProvider>
        }
      />
    );
  }
}
