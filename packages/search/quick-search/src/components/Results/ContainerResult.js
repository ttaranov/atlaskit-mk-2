// @flow
import React, { PureComponent } from 'react';
import Avatar from '@atlaskit/avatar';

import ResultBase from './ResultBase';
import type { ContainerResultType as Props } from './types';

const CONTAINER_RESULT_TYPE = 'container';

// ===================================================================
// If adding a prop or feature that may be useful to all result types,
// add it to ResultBase instead
// ===================================================================

/**
 * Generic result type for Atlassian containers.
 */
export default class ContainerResult extends PureComponent<Props> {
  static defaultProps = {
    isCompact: false,
    isSelected: false,
    onClick: () => {},
    type: CONTAINER_RESULT_TYPE,
  };

  getAvatar = () => {
    if (this.props.avatar) {
      return this.props.avatar;
    }

    return (
      <Avatar
        src={this.props.avatarUrl}
        appearance="square"
        size="small"
        status={this.props.isPrivate ? 'locked' : null}
      />
    );
  };

  render() {
    const { name, ...resultBaseProps } = this.props;
    return (
      <ResultBase {...resultBaseProps} icon={this.getAvatar()} text={name} />
    );
  }
}
