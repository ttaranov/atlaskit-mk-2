import * as React from 'react';
import Avatar from '@atlaskit/avatar';
import { ResultBase } from '@atlaskit/quick-search';

const OBJECT_RESULT_TYPE = 'object';

export interface Props {
  name: string;
  containerName: string;
  avatarUrl?: string;
  objectKey?: string;
}

/**
 * Copy of ObjectResult.js from navigation/quick-search but with a custom subText.
 */
export default class ObjectResult extends React.Component<Props> {
  static defaultProps = {
    isCompact: false,
    isSelected: false,
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    type: OBJECT_RESULT_TYPE,
  };

  getAvatar = () => <Avatar src={this.props.avatarUrl} appearance="square" />;

  getSubtext() {
    const { objectKey, containerName } = this.props;

    if (objectKey) {
      return `${objectKey} · ${containerName}`;
    } else {
      return containerName;
    }
  }

  render() {
    const { name, ...resultBaseProps } = this.props;
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
