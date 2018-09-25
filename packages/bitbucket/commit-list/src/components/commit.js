// @flow
import Avatar from '@atlaskit/avatar';
import { UserAvatar } from '@atlassian/bitkit-avatars';
import type { Commit as CommitType } from '@atlassian/bitkit-flow-types';
import { RelativeDate } from '@atlassian/bitkit-date';
import React, { PureComponent } from 'react';

import * as styles from '../styles';
import { getShortHash } from '../utils/string-helpers';

type CommitProps = {
  commit: CommitType,
  linkTarget?: string,
  parentCommitHash: string,
  handleCommitChange: (
    selectedCommitRangeStart: string,
    selectedCommitRangeEnd: string,
  ) => void,
  selectedCommitRangeStart: string,
  selectedCommitRangeEnd: string,
  showCommitSelector: boolean,
};

export default class Commit extends PureComponent<CommitProps> {
  static defaultProps = {
    handleCommitChange: () => {},
  };

  renderAvatar() {
    const { commit, linkTarget } = this.props;
    const { user } = commit.author;

    if (user) {
      return (
        <UserAvatar
          href={user.links.html.href}
          displayName={user.display_name}
          avatarSrc={user.links.avatar.href}
          size="small"
          target={linkTarget}
        />
      );
    }

    return <Avatar src="" size="small" />;
  }

  isSelected = (commitRangeStart: string, commitRangeEnd: string) => {
    const { selectedCommitRangeStart, selectedCommitRangeEnd } = this.props;

    return (
      commitRangeStart === selectedCommitRangeStart &&
      commitRangeEnd === selectedCommitRangeEnd
    );
  };

  render() {
    const {
      commit,
      handleCommitChange,
      linkTarget: target,
      parentCommitHash,
      showCommitSelector,
    } = this.props;
    const { user } = commit.author;
    const displayName = user ? user.display_name : commit.author.raw;

    return (
      <styles.CommitSelectorOption
        tabIndex={showCommitSelector ? 0 : null}
        onClick={
          showCommitSelector
            ? () => {
                handleCommitChange(parentCommitHash, commit.hash);
              }
            : null
        }
        onKeyPress={e => {
          if (showCommitSelector && e.key === 'Enter') {
            handleCommitChange(parentCommitHash, commit.hash);
          }
        }}
        hasPointerCursor={showCommitSelector}
      >
        {showCommitSelector ? (
          <styles.TableColumn>
            <input
              type="radio"
              value={commit.hash}
              checked={this.isSelected(parentCommitHash, commit.hash)}
            />
          </styles.TableColumn>
        ) : null}
        <styles.TableColumn>{this.renderAvatar()}</styles.TableColumn>
        <styles.TableColumn>{displayName}</styles.TableColumn>
        <styles.TableColumn>
          {showCommitSelector ? (
            <styles.CommitHash>{getShortHash(commit.hash)}</styles.CommitHash>
          ) : (
            <a href={commit.links.html.href} {...(target ? { target } : {})}>
              <styles.CommitHash>{getShortHash(commit.hash)}</styles.CommitHash>
            </a>
          )}
        </styles.TableColumn>
        <styles.TableColumn>{commit.message}</styles.TableColumn>
        <styles.TableColumn>
          <RelativeDate date={commit.date} />
        </styles.TableColumn>
      </styles.CommitSelectorOption>
    );
  }
}
