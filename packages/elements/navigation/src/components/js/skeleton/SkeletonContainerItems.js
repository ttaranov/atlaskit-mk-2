// @flow
import React, { Component } from 'react';

import SkeletonContainerItem from './SkeletonContainerItem';

import SkeletonNavigationItems from '../../styled/skeleton/SkeletonNavigationItems';

export type Props = {
  isCollapsed: boolean,
};

export default class SkeletonContainerItems extends Component<Props> {
  static defaultProps = {
    isCollapsed: false,
  };

  render() {
    return (
      <SkeletonNavigationItems>
        <SkeletonContainerItem isCollapsed={this.props.isCollapsed} />
        <SkeletonContainerItem isCollapsed={this.props.isCollapsed} />
        <SkeletonContainerItem isCollapsed={this.props.isCollapsed} />
        <SkeletonContainerItem isCollapsed={this.props.isCollapsed} />
        <SkeletonContainerItem isCollapsed={this.props.isCollapsed} />
      </SkeletonNavigationItems>
    );
  }
}
