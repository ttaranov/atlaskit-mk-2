import { gridSize } from '@atlaskit/theme';
import React from 'react';
import styled from 'styled-components';

import { commitsArray } from '../src/__tests__/mock-data';
import { CommitList } from '../src/';

import { IntlProvider } from 'react-intl';

const Wrapper = styled.div`
  margin: ${3 * gridSize()}px;
`;

const CommitsWrapper = styled.div`
  margin: ${2 * gridSize()}px ${gridSize()}px;
`;

export default () => (
  <IntlProvider>
    <Wrapper>
      <section>
        <h6>CommitList: Example w/o builds</h6>
        <CommitsWrapper>
          <CommitList commits={commitsArray.slice(0, 5)} linkTarget="_blank" />
        </CommitsWrapper>
      </section>
    </Wrapper>
  </IntlProvider>
);
