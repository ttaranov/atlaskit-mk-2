import { gridSize } from '@atlaskit/theme';
import React from 'react';
import styled from 'styled-components';

import { commitsArray, buildsArray } from '../src/__tests__/mock-data';
import { CommitList } from '../src/';

import { IntlProvider } from 'react-intl';

const Wrapper = styled.div`
  margin: ${3 * gridSize()}px;
`;

const CommitsWrapper = styled.div`
  margin: ${2 * gridSize()}px ${gridSize()}px;
`;

function decorateBuilds(commits) {
  // Get a different chunk offset of buildsArray for each commit
  const buildsChunk = Math.floor(buildsArray.length / commits.length);

  return commits.map((commit, i) => ({
    ...commit,
    extra: {
      builds: buildsArray.slice(buildsChunk * i, buildsChunk * i + buildsChunk),
    },
  }));
}

export default () => (
  <IntlProvider>
    <Wrapper>
      <section>
        <h6>CommitList: Example with table headers</h6>
        <CommitsWrapper>
          <CommitList
            commits={decorateBuilds(commitsArray.slice(0, 5))}
            showHeaders
          />
        </CommitsWrapper>
      </section>
    </Wrapper>
  </IntlProvider>
);
