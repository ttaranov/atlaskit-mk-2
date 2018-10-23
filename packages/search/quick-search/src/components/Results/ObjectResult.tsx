import * as React from 'react';
import Avatar from '@atlaskit/avatar';

import ResultBase from './ResultBase';
import { ObjectResultType as Props } from './types';

const OBJECT_RESULT_TYPE = 'object';

// ===================================================================
// If adding a prop or feature that may be useful to all result types,
// add it to ResultBase instead
// ===================================================================

/**
 * Generic result type for Atlassian objects.
 */
export default class ObjectResult extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    type: OBJECT_RESULT_TYPE,
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

  getSubtext() {
    const { objectKey, containerName } = this.props;

    if (objectKey && containerName) {
      return `${objectKey} · ${containerName}`;
    }

    return containerName || objectKey;
  }

  render() {
    const { containerName, objectKey, name, ...resultBaseProps } = this.props;
    return (
      <ResultBase
        {...resultBaseProps}
        icon={this.getAvatar()}
        subText={this.getSubtext()}
        text={name}
      />
    );
  }
}
