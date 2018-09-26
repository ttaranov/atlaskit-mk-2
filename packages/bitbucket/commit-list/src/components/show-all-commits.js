// @flow
import React, { PureComponent } from 'react';
import * as styles from '../styles';

type showAllCommitsProps = {
  handleCommitChange: (
    selectedCommitRangeStart: string,
    selectedCommitRangeEnd: string,
  ) => void,
  hasBuilds: boolean,
  mergeBaseHash: string,
  mostRecentCommitHash: string,
  selectedCommitRangeStart: string,
  selectedCommitRangeEnd: string,
  showFullDiff: string,
};

export default class ShowAllCommits extends PureComponent<showAllCommitsProps> {
  static defaultProps = {
    hasBuilds: false,
    showFullDiff: 'See all commits',
  };

  isSelected = () => {
    const {
      selectedCommitRangeStart,
      selectedCommitRangeEnd,
      mostRecentCommitHash,
      mergeBaseHash,
    } = this.props;

    return (
      mergeBaseHash === selectedCommitRangeStart &&
      mostRecentCommitHash === selectedCommitRangeEnd
    );
  };

  render() {
    const {
      handleCommitChange,
      hasBuilds,
      mostRecentCommitHash,
      mergeBaseHash,
      showFullDiff,
    } = this.props;

    return (
      <styles.CommitSelectorOption
        tabIndex={0}
        onClick={() => {
          handleCommitChange(mergeBaseHash, mostRecentCommitHash);
        }}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            handleCommitChange(mergeBaseHash, mostRecentCommitHash);
          }
        }}
        hasPointerCursor
      >
        <styles.TableColumn>
          {/* React doesn't like it when you set a `checked` prop without an
          `onChange` handler, but this input is controlled by the
           `handleCommitChange` function prop that's bound to the `tr`,
            so we make the `onChange` handler a no-op. */}
          <input type="radio" checked={this.isSelected()} onChange={() => {}} />
        </styles.TableColumn>
        <td colSpan={hasBuilds ? 6 : 5}>
          <styles.SeeAllCommitsOption>
            {showFullDiff}
          </styles.SeeAllCommitsOption>
        </td>
      </styles.CommitSelectorOption>
    );
  }
}
