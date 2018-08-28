// @flow

import React, { Component, Fragment, type ElementRef } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';
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

export default class LayoutManager extends Component<LayoutManagerProps> {
  productNavRef: HTMLElement;
  pageRef: HTMLElement;

  getNavRef = (ref: ElementRef<*>) => {
    this.productNavRef = ref;
  };
  getPageRef = (ref: ElementRef<*>) => {
    this.pageRef = ref;
  };

  renderGlobalNavigation = (shouldRenderShadow: boolean) => {
    const { globalNavigation: GlobalNavigation } = this.props;
    console.log(
      'LayoutManager: renderGlobalNavigation',
      this.props,
      shouldRenderShadow,
    );
    // debugger; // eslint-disable-line
    return (
      <ThemeProvider
        theme={theme => {
          console.log('LayoutManager: theme provider', theme);
          return {
            mode: light, // If no theme already exists default to light mode
            ...theme,
          };
        }}
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

    console.log('LayoutManager: transition', args);
    console.log('LayoutManager: props', this.props);
    // debugger; // eslint-disable-line

    return (
      <ContentNavigationWrapper
        key="product-nav-wrapper"
        innerRef={this.getNavRef}
        disableInteraction={shouldDisableInteraction}
        style={transitionStyle}
      >
        {isVisible && (
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
        )}
      </ContentNavigationWrapper>
    );
  };

  renderNavigation = () => {
    const {
      navigationUIController,
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
    } = this.props;
    const {
      isCollapsed,
      isPeeking,
      isResizing,
      productNavWidth,
    } = navigationUIController.state;

    console.log(
      'LayoutManager: navigation props to be rendered',
      navigationUIController,
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
    );
    // debugger; // eslint-disable-line

    return (
      <NavigationAnalyticsContext
        data={{
          attributes: { isExpanded: !isCollapsed },
          componentName: 'navigation',
          packageName,
          packageVersion,
        }}
      >
        <ResizeTransition
          from={[0]}
          in={!isCollapsed}
          properties={['width']}
          to={[productNavWidth]}
          userIsDragging={isResizing}
          // only apply listeners to the NAV resize transition
          productNavWidth={productNavWidth}
          onExpandStart={onExpandStart}
          onExpandEnd={onExpandEnd}
          onCollapseStart={onCollapseStart}
          onCollapseEnd={onCollapseEnd}
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
      </NavigationAnalyticsContext>
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
        productNavWidth={productNavWidth}
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
