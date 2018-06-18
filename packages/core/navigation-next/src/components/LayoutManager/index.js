// @flow

import PropTypes from 'prop-types';
import React, { Component, Fragment, type ElementRef } from 'react';
import { ThemeProvider } from 'emotion-theming';

import { NavigationSubscriber } from '../../state';
import { Shadow } from '../../common/primitives';
import { light } from '../../theme';
import ProductNav from '../ProductNav';
import ResizeTransition, { isTransitioning } from './ResizeTransition';
import ResizeControl from './ResizeControl';
import {
  ContainerNavMask,
  LayoutContainer,
  NavContainer,
  PageWrapper,
  ProductNavWrapper,
} from './primitives';
import type { LayoutManagerProps, WrappedLayoutManagerProps } from './types';

import { GLOBAL_NAV_WIDTH } from '../../common/constants';

class LayoutManager extends Component<LayoutManagerProps> {
  productNavRef: HTMLElement;
  pageRef: HTMLElement;
  static childContextTypes = {
    defaultDrawerIcon: PropTypes.func,
  };

  getChildContext() {
    return { defaultDrawerIcon: this.props.defaultDrawerIcon };
  }

  renderGlobalNav(activeTransition) {
    const { navigation, globalNavigation: GlobalNavigation } = this.props;
    const { isPeeking, productNavIsCollapsed } = navigation.state;
    const displayShadow =
      productNavIsCollapsed && !isPeeking && !activeTransition;
    return (
      <ThemeProvider
        theme={theme => ({
          mode: light, // If no theme already exists default to light mode
          ...theme,
          context: navigation.state.productNavIsCollapsed
            ? 'collapsed'
            : 'expanded',
        })}
      >
        <Fragment>
          {displayShadow ? (
            <Shadow isOverDarkBg style={{ marginLeft: GLOBAL_NAV_WIDTH }} />
          ) : null}
          <GlobalNavigation />
        </Fragment>
      </ThemeProvider>
    );
  }
  renderProductNav({
    disableInteraction,
    isDragging,
    isVisible,
    transitionState,
    transitionStyle,
    width,
  }) {
    const {
      navigation,
      productRootNavigation,
      productContainerNavigation,
    } = this.props;
    const { isHinting, isPeeking } = navigation.state;

    return (
      <ProductNavWrapper
        key="product-nav-wrapper"
        innerRef={this.getNavRef}
        disableInteraction={disableInteraction}
        style={transitionStyle}
      >
        {isVisible ? (
          <ProductNav
            container={productContainerNavigation}
            isDragging={isDragging}
            isHinting={isHinting}
            isPeeking={isPeeking}
            key="product-nav"
            onOverlayClick={navigation.unPeek}
            root={productRootNavigation}
            transitionState={transitionState}
            width={width}
          />
        ) : null}
      </ProductNavWrapper>
    );
  }
  navRenderFn = ({ transitionStyle, transitionState }) => {
    const { navigation } = this.props;
    const { isResizing } = navigation.state;
    const isVisible = transitionState !== 'exited';
    const activeTransition = isTransitioning(transitionState);
    const disableInteraction = isResizing || activeTransition;

    return (
      <NavContainer>
        <ResizeControl
          navigation={navigation}
          mutationRefs={[
            { ref: this.pageRef, property: 'padding-left' },
            { ref: this.productNavRef, property: 'width' },
          ]}
        >
          {({ isDragging, width }) => (
            <ContainerNavMask>
              {this.renderGlobalNav(activeTransition)}
              {this.renderProductNav({
                disableInteraction,
                isDragging,
                isVisible,
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
  pageRenderFn = ({ transitionStyle, transitionState }) => {
    const activeTransition = isTransitioning(transitionState);
    const { isResizing } = this.props.navigation.state;
    return (
      <PageWrapper
        disableInteraction={isResizing || activeTransition}
        innerRef={this.getPageRef}
        offset={GLOBAL_NAV_WIDTH}
        style={transitionStyle}
      >
        {this.props.children}
      </PageWrapper>
    );
  };
  getNavRef = (ref: ElementRef<*>) => {
    this.productNavRef = ref;
  };
  getPageRef = (ref: ElementRef<*>) => {
    this.pageRef = ref;
  };

  render() {
    const { navigation } = this.props;
    const {
      isResizing,
      productNavIsCollapsed,
      productNavWidth,
    } = navigation.state;

    return (
      <Fragment>
        <LayoutContainer>
          <ResizeTransition
            from={[0]}
            in={!productNavIsCollapsed}
            properties={['width']}
            to={[productNavWidth]}
            userIsDragging={isResizing}
          >
            {this.navRenderFn}
          </ResizeTransition>
          <ResizeTransition
            from={[0]}
            in={!productNavIsCollapsed}
            properties={['paddingLeft']}
            to={[productNavWidth]}
            userIsDragging={isResizing}
          >
            {this.pageRenderFn}
          </ResizeTransition>
        </LayoutContainer>
      </Fragment>
    );
  }
}

export default (props: WrappedLayoutManagerProps) => (
  <NavigationSubscriber>
    {navigation => <LayoutManager navigation={navigation} {...props} />}
  </NavigationSubscriber>
);
