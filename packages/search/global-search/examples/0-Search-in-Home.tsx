import * as React from 'react';
import { GlobalQuickSearch } from '../src/index';
import BasicNavigation from '../example-helpers/BasicNavigation';
import { setupMocks, teardownMocks } from '../example-helpers/mockApis';
import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';

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
          <LocaleIntlProvider>
            <GlobalQuickSearch cloudId="cloudId" context="home" />
          </LocaleIntlProvider>
        }
      />
    );
  }
}
