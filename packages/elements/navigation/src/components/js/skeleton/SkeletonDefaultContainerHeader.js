// @flow
import React, { Component } from 'react';

import { Avatar, Paragraph } from '@atlaskit/skeleton';

import { HiddenWhenCollapsed } from './ToggleWhenCollapsed';

import SkeletonContainerItemText from '../../styled/skeleton/SkeletonContainerItemText';
import SkeletonDefaultContainerHeaderInner from '../../styled/skeleton/SkeletonDefaultContainerHeaderInner';

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
        <Avatar appearance="square" size="large" weight="strong" />
        <HiddenWhenCollapsed isCollapsed={this.props.isCollapsed}>
          <SkeletonContainerItemText>
            <Paragraph weight="strong" />
          </SkeletonContainerItemText>
        </HiddenWhenCollapsed>
      </SkeletonDefaultContainerHeaderInner>
    );
  }
}
