// @flow
import React, { Component } from 'react';

import { Skeleton as SkeletonAvatar } from '@atlaskit/avatar';

import { HiddenWhenCollapsed } from './ToggleWhenCollapsed';

import SkeletonContainerHeaderText from './styled/SkeletonContainerHeaderText';
import SkeletonDefaultContainerHeaderInner from './styled/SkeletonDefaultContainerHeaderInner';

export type Props = {
  isCollapsed: boolean,
};

export default class SkeletonDefaultContainerHeader extends Component<Props> {
  static defaultProps = {
    isCollapsed: false,
  };

  render() {
    return (
      <SkeletonDefaultContainerHeaderInner>
        <SkeletonAvatar appearance="square" size="large" weight="strong" />
        <HiddenWhenCollapsed isCollapsed={this.props.isCollapsed}>
          <SkeletonContainerHeaderText />
        </HiddenWhenCollapsed>
      </SkeletonDefaultContainerHeaderInner>
    );
  }
}
