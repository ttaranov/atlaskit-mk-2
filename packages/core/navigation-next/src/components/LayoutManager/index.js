// @flow

import React, { Component, Fragment, type ElementRef } from 'react';
import { ThemeProvider } from 'emotion-theming';

import { withNavigationUI } from '../../ui-state';
import { Shadow } from '../../common/primitives';
import { light } from '../../theme';
import ContentNavigation from '../ContentNavigation';
import ResizeTransition, { isTransitioning } from './ResizeTransition';
import ResizeControl from './ResizeControl';
import {
  ContainerNavMask,
  LayoutContainer,
  NavContainer,
  PageWrapper,
  ContentNavigationWrapper,
} from './primitives';
import type { LayoutManagerProps } from './types';

import { GLOBAL_NAV_WIDTH } from '../../common/constants';

class LayoutManager extends Component<LayoutManagerProps> {
  productNavRef: HTMLElement;
  pageRef: HTMLElement;

  renderGlobalNav(shouldRenderShadow) {
    const { navigationUI, globalNavigation: GlobalNavigation } = this.props;
    const { isCollapsed } = navigationUI.state;
    return (
      <ThemeProvider
        theme={theme => ({
          mode: light, // If no theme already exists default to light mode
          ...theme,
          context: isCollapsed ? 'collapsed' : 'expanded',
        })}
      >
        <Fragment>
          {shouldRenderShadow ? (
            <Shadow isOverDarkBg style={{ marginLeft: GLOBAL_NAV_WIDTH }} />
          ) : null}
          <GlobalNavigation />
        </Fragment>
      </ThemeProvider>
    );
  }
  renderContentNavigation({
    disableInteraction,
    isDragging,
    transitionState,
    transitionStyle,
    width,
  }) {
    const { navigationUI, productNavigation, containerNavigation } = this.props;
    const { isPeekHinting, isPeeking } = navigationUI.state;

    const isVisible = transitionState !== 'exited';

    return (
      <ContentNavigationWrapper
        key="product-nav-wrapper"
        innerRef={this.getNavRef}
        disableInteraction={disableInteraction}
        style={transitionStyle}
      >
        {isVisible ? (
          <ContentNavigation
            container={containerNavigation}
            isDragging={isDragging}
            isPeekHinting={isPeekHinting}
            isPeeking={isPeeking}
            key="product-nav"
            onOverlayClick={navigationUI.unPeek}
            product={productNavigation}
            transitionState={transitionState}
            width={width}
          />
        ) : null}
      </ContentNavigationWrapper>
    );
  }
  renderNavigation = ({ transitionStyle, transitionState }) => {
    const { navigationUI } = this.props;
    const { isCollapsed, isPeeking, isResizing } = navigationUI.state;

    const isTransitionActive = isTransitioning(transitionState);
    const disableInteraction = isResizing || isTransitionActive;
    const shouldRenderGlobalNavShadow =
      isCollapsed && !isPeeking && !isTransitionActive;

    return (
      <NavContainer>
        <ResizeControl
          navigation={navigationUI}
          mutationRefs={[
            { ref: this.pageRef, property: 'padding-left' },
            { ref: this.productNavRef, property: 'width' },
          ]}
        >
          {({ isDragging, width }) => (
            <ContainerNavMask>
              {this.renderGlobalNav(shouldRenderGlobalNavShadow)}
              {this.renderContentNavigation({
                disableInteraction,
                isDragging,
                transitionState,
                transitionStyle,
                width,
              })}
            </ContainerNavMask>
          )}
        </ResizeControl>
      </NavContainer>
    );
  };
  renderPage() {
    const {
      isResizing,
      isCollapsed,
      productNavWidth,
    } = this.props.navigationUI.state;
    return (
      <ResizeTransition
        from={[0]}
        in={!isCollapsed}
        properties={['paddingLeft']}
        to={[productNavWidth]}
        userIsDragging={isResizing}
      >
        {({ transitionStyle, transitionState }) => (
          <PageWrapper
            disableInteraction={isResizing || isTransitioning(transitionState)}
            innerRef={this.getPageRef}
            offset={GLOBAL_NAV_WIDTH}
            style={transitionStyle}
          >
            {this.props.children}
          </PageWrapper>
        )}
      </ResizeTransition>
    );
  }
  getNavRef = (ref: ElementRef<*>) => {
    this.productNavRef = ref;
  };
  getPageRef = (ref: ElementRef<*>) => {
    this.pageRef = ref;
  };

  render() {
    const { navigationUI } = this.props;
    const { isResizing, isCollapsed, productNavWidth } = navigationUI.state;

    return (
      <LayoutContainer>
        <ResizeTransition
          from={[0]}
          in={!isCollapsed}
          properties={['width']}
          to={[productNavWidth]}
          userIsDragging={isResizing}
        >
          {this.renderNavigation}
        </ResizeTransition>
        {this.renderPage()}
      </LayoutContainer>
    );
  }
}

export default withNavigationUI(LayoutManager);
