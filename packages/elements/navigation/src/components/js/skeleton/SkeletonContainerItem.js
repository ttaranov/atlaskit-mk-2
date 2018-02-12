// @flow
import React, { Component } from 'react';

import { Icon, Paragraph } from '@atlaskit/skeleton';

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
        <Icon />
        <HiddenWhenCollapsed isCollapsed={this.props.isCollapsed}>
          <SkeletonContainerItemText>
            <Paragraph />
          </SkeletonContainerItemText>
        </HiddenWhenCollapsed>
      </SkeletonContainerItemWrapper>
    );
  }
}
