import { gridSize } from '@atlaskit/theme';
import React from 'react';
import styled from 'styled-components';

import { commitsArray, buildsArray } from '../src/__tests__/mock-data';
import { CommitList, CommitSelector } from '../src/';

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

class DynamicCommitList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      commits: props.commits.slice(0, 5),
      hasMore: props.commits.length > 5,
      isLoading: false,
    };
  }

  onShowMoreClick = () => {
    this.setState({ isLoading: true });
    setTimeout(() => {
      const { commits } = this.props;

      this.setState({
        commits,
        hasMore: false,
        isLoading: false,
      });
    }, 2500);
  };

  render() {
    const { commits, hasMore, ...props } = this.props;
    return (
      <CommitList
        commits={this.state.commits}
        hasMore={this.state.hasMore}
        isLoading={this.state.isLoading}
        onShowMoreClick={this.onShowMoreClick}
        {...props}
      />
    );
  }
}

export default () => (
  <Wrapper>
    <section>
      <h6>CommitList: Example w/o builds</h6>
      <CommitsWrapper>
        <CommitList commits={commitsArray.slice(0, 5)} linkTarget="_blank" />
      </CommitsWrapper>
    </section>
    <section>
      <h6>CommitList: Example with builds</h6>
      <CommitsWrapper>
        <CommitList commits={decorateBuilds(commitsArray.slice(0, 5))} />
      </CommitsWrapper>
    </section>
    <section>
      <h6>CommitList: Example with table headers</h6>
      <CommitsWrapper>
        <CommitList
          commits={decorateBuilds(commitsArray.slice(0, 5))}
          showHeaders
        />
      </CommitsWrapper>
    </section>
    <section>
      <h6>CommitList: Example with dynamic loading</h6>
      <CommitsWrapper>
        <DynamicCommitList commits={commitsArray} />
      </CommitsWrapper>
    </section>
    <section>
      <h6>
        CommitSelector: Example CommitList with commit selector radio inputs
      </h6>
      <CommitsWrapper>
        <CommitSelector commits={commitsArray} linkTarget="_blank" />
      </CommitsWrapper>
    </section>
  </Wrapper>
);
