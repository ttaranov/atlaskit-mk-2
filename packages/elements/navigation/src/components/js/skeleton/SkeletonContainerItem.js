// @flow
import React, { Component } from 'react';

import { Skeleton as SkeletonIcon } from '@atlaskit/icon';

import { HiddenWhenCollapsed } from './ToggleWhenCollapsed';

import SkeletonContainerItemWrapper from '../../styled/skeleton/SkeletonContainerItemWrapper';
import SkeletonContainerItemText from '../../styled/skeleton/SkeletonContainerItemText';

type Props = {
  isCollapsed: boolean,
};

export default class SkeletonContainerItem extends Component<Props> {
  static defaultProps = {
    isCollapsed: false,
  };
  render() {
    return (
      <SkeletonContainerItemWrapper>
        <SkeletonIcon />
        <HiddenWhenCollapsed isCollapsed={this.props.isCollapsed}>
          <SkeletonContainerItemText />
        </HiddenWhenCollapsed>
      </SkeletonContainerItemWrapper>
    );
  }
}
