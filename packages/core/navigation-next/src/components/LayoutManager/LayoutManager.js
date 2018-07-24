// @flow

import React, { Component, Fragment, type ElementRef } from 'react';
import { ThemeProvider } from 'emotion-theming';

import { Shadow } from '../../common/primitives';
import { light } from '../../theme';
import ContentNavigation from '../ContentNavigation';
import ResizeTransition, {
  isTransitioning,
  type TransitionState,
} from './ResizeTransition';
import ResizeControl from './ResizeControl';
import {
  ContainerNavigationMask,
  ContentNavigationWrapper,
  LayoutContainer,
  NavigationContainer,
  PageWrapper,
} from './primitives';
import type { LayoutManagerProps } from './types';

import { GLOBAL_NAV_WIDTH } from '../../common/constants';

type RenderContentNavigationArgs = {
  isDragging: boolean,
  transitionState: TransitionState,
  transitionStyle: Object,
  width: number,
};

function NOOP() {}

export default class LayoutManager extends Component<LayoutManagerProps> {
  productNavRef: HTMLElement;
  pageRef: HTMLElement;

  static defaultProps = {
    onExpandStart: NOOP,
    onExpandEnd: NOOP,
    onCollapseStart: NOOP,
    onCollapseEnd: NOOP,
  };

  getNavRef = (ref: ElementRef<*>) => {
    this.productNavRef = ref;
  };
  getPageRef = (ref: ElementRef<*>) => {
    this.pageRef = ref;
  };

  onExpandStart = () => {
    const { isResizing } = this.props.navigationUIController.state;

    if (isResizing) return;

    this.props.onExpandStart(0);
  };
  onExpandEnd = () => {
    const {
      isResizing,
      productNavWidth,
    } = this.props.navigationUIController.state;

    if (isResizing) return;

    this.props.onExpandEnd(productNavWidth);
  };
  onCollapseStart = () => {
    const {
      isResizing,
      productNavWidth,
    } = this.props.navigationUIController.state;

    if (isResizing) return;

    this.props.onCollapseStart(productNavWidth);
  };
  onCollapseEnd = () => {
    const { isResizing } = this.props.navigationUIController.state;

    if (isResizing) return;

    this.props.onCollapseEnd(0);
  };

  renderGlobalNavigation = (shouldRenderShadow: boolean) => {
    const { globalNavigation: GlobalNavigation } = this.props;
    return (
      <ThemeProvider
        theme={theme => ({
          mode: light, // If no theme already exists default to light mode
          ...theme,
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
  };

  renderContentNavigation = (args: RenderContentNavigationArgs) => {
    const { isDragging, transitionState, transitionStyle, width } = args;
    const {
      containerNavigation,
      navigationUIController,
      productNavigation,
    } = this.props;
    const {
      isPeekHinting,
      isPeeking,
      isResizing,
    } = navigationUIController.state;

    const isVisible = transitionState !== 'exited';
    const shouldDisableInteraction =
      isResizing || isTransitioning(transitionState);

    return (
      <ContentNavigationWrapper
        key="product-nav-wrapper"
        innerRef={this.getNavRef}
        disableInteraction={shouldDisableInteraction}
        style={transitionStyle}
      >
        {isVisible ? (
          <ContentNavigation
            container={containerNavigation}
            isDragging={isDragging}
            isPeekHinting={isPeekHinting}
            isPeeking={isPeeking}
            key="product-nav"
            onOverlayClick={navigationUIController.unPeek}
            product={productNavigation}
            transitionState={transitionState}
            width={width}
          />
        ) : null}
      </ContentNavigationWrapper>
    );
  };

  renderNavigation = () => {
    const { navigationUIController } = this.props;
    const {
      isCollapsed,
      isPeeking,
      isResizing,
      productNavWidth,
    } = navigationUIController.state;

    return (
      <ResizeTransition
        from={[0]}
        in={!isCollapsed}
        properties={['width']}
        to={[productNavWidth]}
        userIsDragging={isResizing}
      >
        {({ transitionStyle, transitionState }) => {
          const shouldRenderGlobalNavShadow =
            isCollapsed && !isPeeking && !isTransitioning(transitionState);

          return (
            <NavigationContainer>
              <ResizeControl
                navigation={navigationUIController}
                mutationRefs={[
                  { ref: this.pageRef, property: 'padding-left' },
                  { ref: this.productNavRef, property: 'width' },
                ]}
              >
                {({ isDragging, width }) => (
                  <ContainerNavigationMask>
                    {this.renderGlobalNavigation(shouldRenderGlobalNavShadow)}
                    {this.renderContentNavigation({
                      isDragging,
                      transitionState,
                      transitionStyle,
                      width,
                    })}
                  </ContainerNavigationMask>
                )}
              </ResizeControl>
            </NavigationContainer>
          );
        }}
      </ResizeTransition>
    );
  };

  renderPage = () => {
    const {
      isResizing,
      isCollapsed,
      productNavWidth,
    } = this.props.navigationUIController.state;
    return (
      <ResizeTransition
        from={[0]}
        in={!isCollapsed}
        properties={['paddingLeft']}
        to={[productNavWidth]}
        userIsDragging={isResizing}
        // only apply listeners to the NAV resize transition
        onExpandStart={this.onExpandStart}
        onExpandEnd={this.onExpandEnd}
        onCollapseStart={this.onCollapseStart}
        onCollapseEnd={this.onCollapseEnd}
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
  };

  render() {
    return (
      <LayoutContainer>
        {this.renderNavigation()}
        {this.renderPage()}
      </LayoutContainer>
    );
  }
}
