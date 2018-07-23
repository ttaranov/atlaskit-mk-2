import * as React from 'react';
import styled from 'styled-components';
import BasicNavigation from '../example-helpers/BasicNavigation';
import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';

import { GlobalQuickSearch } from '../src/index';

const Outer = styled.div`
  height: 100vh;
`;

export default class extends React.Component {
  render() {
    return (
      <Outer>
        <BasicNavigation
          searchDrawerContent={
            <LocaleIntlProvider>
              <GlobalQuickSearch cloudId="cloudId" context="confluence" />
            </LocaleIntlProvider>
          }
        />
      </Outer>
    );
  }
}
