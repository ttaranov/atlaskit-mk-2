// @flow
import React, { PureComponent } from 'react';
import type { Commit as CommitType } from '@atlassian/bitkit-flow-types';

import CommitList from './commit-list';

export type CommitSelectorProps = {
  commits: Array<CommitType>,
  hasMore: boolean,
  isLoading: boolean,
  mergeBaseHash: string,
  onCommitRangeChange: (
    selectedCommitRangeStart: ?string,
    selectedCommitRangeEnd: string,
  ) => void,
  onShowMoreClick: Function,
  showCommitSelector: boolean,
};

type CommitSelectorState = {
  selectedCommitRangeStart?: string,
  selectedCommitRangeEnd: string,
};

export default class CommitSelector extends PureComponent<
  CommitSelectorProps,
  CommitSelectorState,
> {
  static defaultProps = {
    commits: [],
    hasMore: false,
    isLoading: false,
    mergeBaseHash: '',
    onCommitRangeChange: () => {},
    onShowMoreClick: () => {},
    showCommitSelector: true,
  };

  state = {
    selectedCommitRangeStart: this.props.mergeBaseHash,
    selectedCommitRangeEnd: this.props.commits[0]
      ? this.props.commits[0].hash
      : '',
  };

  handleCommitChange = (
    selectedCommitRangeStart: string,
    selectedCommitRangeEnd: string,
  ): void => {
    this.setState({
      selectedCommitRangeStart,
      selectedCommitRangeEnd,
    });

    this.props.onCommitRangeChange(
      selectedCommitRangeStart,
      selectedCommitRangeEnd,
    );
  };

  render() {
    return (
      <CommitList
        handleCommitChange={this.handleCommitChange}
        selectedCommitRangeStart={this.state.selectedCommitRangeStart}
        selectedCommitRangeEnd={this.state.selectedCommitRangeEnd}
        {...this.props}
      />
    );
  }
}
