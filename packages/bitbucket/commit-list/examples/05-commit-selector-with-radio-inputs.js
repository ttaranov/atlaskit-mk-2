import { gridSize } from '@atlaskit/theme';
import React from 'react';
import styled from 'styled-components';

import { commitsArray } from '../src/__tests__/mock-data';
import { CommitSelector } from '../src/';

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
        <h6>
          CommitSelector: Example CommitList with commit selector radio inputs
        </h6>
        <CommitsWrapper>
          <CommitSelector commits={commitsArray} linkTarget="_blank" />
        </CommitsWrapper>
      </section>
    </Wrapper>
  </IntlProvider>
);
