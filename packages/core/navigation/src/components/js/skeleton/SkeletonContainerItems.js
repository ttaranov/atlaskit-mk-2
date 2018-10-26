// @flow
import React, { Component } from 'react';

import SkeletonContainerItem from './SkeletonContainerItem';

import SkeletonNavigationItems from './styled/SkeletonNavigationItems';

export type Props = {
  isCollapsed?: boolean,
  itemTextWidth?: string,
};

export default function SkeletonContainerItems (props) {
  static defaultProps = {
    isCollapsed: false,
  };

  render() {
    const { isCollapsed, itemTextWidth } = this.props;
    return (
      <SkeletonNavigationItems>
        <SkeletonContainerItem
          isCollapsed={isCollapsed}
          itemTextWidth={itemTextWidth}
        />
        <SkeletonContainerItem
          isCollapsed={isCollapsed}
          itemTextWidth={itemTextWidth}
        />
        <SkeletonContainerItem
          isCollapsed={isCollapsed}
          itemTextWidth={itemTextWidth}
        />
        <SkeletonContainerItem
          isCollapsed={isCollapsed}
          itemTextWidth={itemTextWidth}
        />
        <SkeletonContainerItem
          isCollapsed={isCollapsed}
          itemTextWidth={itemTextWidth}
        />
      </SkeletonNavigationItems>
    );
  }
}
