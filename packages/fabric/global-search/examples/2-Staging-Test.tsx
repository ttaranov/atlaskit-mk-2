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
  render() {
    return (
      <OuterBorder>
        <BasicNavigation
          searchDrawerContent={
            <GlobalQuickSearch
              cloudId="DUMMY-7c8a2b74-595a-41c7-960c-fd32f8572cea"
              environment="staging"
            />
          }
        />
      </OuterBorder>
    );
  }
}
