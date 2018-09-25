// @flow
import type { Commit as CommitType } from '@atlassian/bitkit-flow-types';
import Button from '@atlaskit/button';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import Spinner from '@atlaskit/spinner';

import messages from '../i18n';
import * as styles from '../styles';

import ShowAllCommits from './show-all-commits';
import Commit from './commit';

export type CommitListProps = {
  commits: Array<CommitType>,
  handleCommitChange: (
    selectedCommitRangeStart: string,
    selectedCommitRangeEnd: string,
  ) => void,
  hasMore: boolean,
  isLoading: boolean,
  linkTarget?: string,
  mergeBaseHash: string,
  onShowMoreClick: Function,
  selectedCommitRangeEnd: string,
  selectedCommitRangeStart: string,
  showCommitSelector: boolean,
  showHeaders: boolean,
};

export default class CommitList extends PureComponent<CommitListProps> {
  static defaultProps = {
    commits: [],
    handleCommitChange: () => {},
    hasMore: false,
    isLoading: false,
    mergeBaseHash: '',
    onShowMoreClick: () => {},
    selectedCommitRangeEnd: '',
    selectedCommitRangeStart: '',
    showCommitSelector: false,
    showHeaders: false,
  };

  hasBuilds() {
    const { commits } = this.props;
    const predicate = commit => !!commit.extra && !!commit.extra.builds;

    return commits.some(predicate);
  }

  renderColumnDefinitions() {
    const { showCommitSelector } = this.props;
    const hasBuilds = this.hasBuilds();

    return (
      <colgroup>
        {showCommitSelector ? <styles.CommitSelectorColumnDefinition /> : null}
        <styles.AvatarColumnDefinition />
        <styles.AuthorColumnDefinition />
        <styles.CommitHashColumnDefinition />
        <col />
        <styles.DateColumnDefinition />
        {hasBuilds ? <styles.BuildsColumnDefinition /> : null}
      </colgroup>
    );
  }

  renderColumnHeaders() {
    const { showCommitSelector } = this.props;
    const hasBuilds = this.hasBuilds();

    return (
      <thead>
        <tr>
          {showCommitSelector ? <styles.TableHeader /> : null}
          <styles.TableHeader colSpan="2">
            <FormattedMessage {...messages.authorHeader} />
          </styles.TableHeader>
          <styles.TableHeader>
            <FormattedMessage {...messages.hashHeader} />
          </styles.TableHeader>
          <styles.TableHeader>
            <FormattedMessage {...messages.messageHeader} />
          </styles.TableHeader>
          <styles.TableHeader>
            <FormattedMessage {...messages.dateHeader} />
          </styles.TableHeader>
          {hasBuilds ? (
            <styles.BuildsTableHeader>
              <FormattedMessage {...messages.buildsHeader} />
            </styles.BuildsTableHeader>
          ) : null}
        </tr>
      </thead>
    );
  }

  render() {
    const {
      commits,
      hasMore,
      isLoading,
      linkTarget,
      onShowMoreClick,
      showCommitSelector,
      handleCommitChange,
      mergeBaseHash,
      showHeaders,
    } = this.props;

    const hasBuilds = this.hasBuilds();

    const commitsLength = commits.length;

    return (
      <styles.CommitsWrapper>
        <styles.Commits>
          {this.renderColumnDefinitions()}
          {showHeaders && this.renderColumnHeaders()}
          <styles.CommitsTableBody showHeaders={showHeaders}>
            {showCommitSelector ? (
              <ShowAllCommits
                handleCommitChange={handleCommitChange}
                hasBuilds={hasBuilds}
                selectedCommitRangeStart={this.props.selectedCommitRangeStart}
                selectedCommitRangeEnd={this.props.selectedCommitRangeEnd}
                mostRecentCommitHash={commits ? commits[0].hash : ''}
                mergeBaseHash={mergeBaseHash}
              />
            ) : null}
            {commits.map((commit, index) => {
              let parentCommitHash;
              const parents = commit.parents || [];
              // If it is the first commit, then unset the parent commit hash
              // and let the back-end figure out what the correct parent commit
              // or merge-base hash is.
              if (commitsLength === index + 1) {
                parentCommitHash = '';
              } else {
                // Only supports 'simple' commits with a single parent and
                // if it's a merge commit we only take the first parent commit
                parentCommitHash = parents.length
                  ? parents[0].hash
                  : commits[index + 1].hash;
              }

              return (
                <Commit
                  key={commit.hash}
                  commit={commit}
                  linkTarget={linkTarget}
                  showCommitSelector={showCommitSelector}
                  parentCommitHash={parentCommitHash}
                  handleCommitChange={handleCommitChange}
                  selectedCommitRangeStart={this.props.selectedCommitRangeStart}
                  selectedCommitRangeEnd={this.props.selectedCommitRangeEnd}
                />
              );
            })}
          </styles.CommitsTableBody>
        </styles.Commits>
        {hasMore &&
          !isLoading && (
            <styles.ShowMoreBtnContainer>
              <Button
                appearance="link"
                onClick={onShowMoreClick}
                shouldFitContainer
              >
                <FormattedMessage {...messages.showMoreCommits} />
              </Button>
            </styles.ShowMoreBtnContainer>
          )}
        {isLoading && (
          <styles.CommitsLoadingSpinner>
            <Spinner size="medium" />
          </styles.CommitsLoadingSpinner>
        )}
      </styles.CommitsWrapper>
    );
  }
}
