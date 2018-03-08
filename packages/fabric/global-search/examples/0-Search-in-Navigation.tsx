import * as React from 'react';
import { GlobalQuickSearch } from '../src/index';
import BasicNavigation from '../example-helpers/BasicNavigation';
import { setupMocks, teardownMocks } from '../example-helpers/mockApis';
import styled from 'styled-components';

const OuterBorder = styled.div`
  border: #ddd 1px solid;
  border-radius: 3px;
`;

export default class extends React.Component {
  componentWillMount() {
    setupMocks();
  }

  componentWillUnmount() {
    teardownMocks();
  }

  render() {
    return (
      <OuterBorder>
        <BasicNavigation
          searchDrawerContent={<GlobalQuickSearch cloudId="cloudId" />}
        />
      </OuterBorder>
    );
  }
}
