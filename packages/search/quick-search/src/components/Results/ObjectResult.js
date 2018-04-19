// @flow
import React, { PureComponent } from 'react';
import Avatar from '@atlaskit/avatar';

import ResultBase from './ResultBase';
import type { ObjectResultType as Props } from './types';

const OBJECT_RESULT_TYPE = 'object';

// ===================================================================
// If adding a prop or feature that may be useful to all result types,
// add it to ResultBase instead
// ===================================================================

/**
 * Generic result type for Atlassian objects.
 */
export default class ObjectResult extends PureComponent<Props> {
  static defaultProps = {
    isCompact: false,
    isSelected: false,
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    type: OBJECT_RESULT_TYPE,
  };

  getAvatar = () =>
    this.props.avatar ? (
      this.props.avatar
    ) : (
      <Avatar
        src={this.props.avatarUrl}
        appearance="square"
        status={this.props.isPrivate ? 'locked' : null}
      />
    );

  render() {
    const { containerName, objectKey, name, ...resultBaseProps } = this.props;
    return (
      <ResultBase
        {...resultBaseProps}
        icon={this.getAvatar()}
        subText={`${objectKey ? `${objectKey} ` : ''}in ${containerName}`}
        text={name}
      />
    );
  }
}
