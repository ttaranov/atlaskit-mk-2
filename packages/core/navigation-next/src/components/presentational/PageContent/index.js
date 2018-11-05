// @flow

import React, { PureComponent, type Ref, type Node } from 'react';
import { PageWrapper } from './primitives';
import type { CollapseListeners } from '../LayoutManager/types';
import ResizeTransition, { isTransitioning } from '../ResizeTransition';

import {
  CONTENT_NAV_WIDTH_COLLAPSED,
  CONTENT_NAV_WIDTH_FLYOUT,
  GLOBAL_NAV_WIDTH,
} from '../../../common/constants';

type PageProps = CollapseListeners & {
  children: Node,
  flyoutIsOpen: boolean,
  innerRef: Ref<'div'>,
  isResizing: boolean,
  isCollapsed: boolean,
  productNavWidth: number,
};

export default class PageContent extends PureComponent<PageProps> {
  render() {
    const {
      flyoutIsOpen,
      innerRef,
      isResizing,
      isCollapsed,
      productNavWidth,
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
    } = this.props;
    return (
      <ResizeTransition
        from={[CONTENT_NAV_WIDTH_COLLAPSED]}
        in={!isCollapsed}
        productNavWidth={productNavWidth}
        properties={['paddingLeft']}
        to={[flyoutIsOpen ? CONTENT_NAV_WIDTH_FLYOUT : productNavWidth]}
        userIsDragging={isResizing}
        /* Attach expand/collapse callbacks to the page resize transition to ensure they are only
         * called when the nav is permanently expanded/collapsed, i.e. when page content position changes. */
        onExpandStart={onExpandStart}
        onExpandEnd={onExpandEnd}
        onCollapseStart={onCollapseStart}
        onCollapseEnd={onCollapseEnd}
      >
        {({ transitionStyle, transitionState }) => (
          <PageWrapper
            disableInteraction={isResizing || isTransitioning(transitionState)}
            innerRef={innerRef}
            offset={GLOBAL_NAV_WIDTH}
            style={transitionStyle}
          >
            {this.props.children}
          </PageWrapper>
        )}
      </ResizeTransition>
    );
  }
}
