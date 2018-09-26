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
  <IntlProvider>
    <Wrapper>
      <section>
        <h6>CommitList: Example with dynamic loading</h6>
        <CommitsWrapper>
          <DynamicCommitList commits={commitsArray} />
        </CommitsWrapper>
      </section>
    </Wrapper>
  </IntlProvider>
);
