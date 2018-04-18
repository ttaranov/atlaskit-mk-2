// @flow

import PropTypes from 'prop-types';
import React, { Component, Fragment, type ElementRef } from 'react';
import { ThemeProvider } from 'emotion-theming';

import { NavigationSubscriber } from '../../state';
import { Shadow } from '../../common/primitives';
import { light } from '../../theme';
import ProductNav from '../ProductNav';
import ResizeTransition from './ResizeTransition';
import ResizeControl from './ResizeControl';
import {
  LayoutContainer,
  PageWrapper,
  NavContainer,
  ProductNavWrapper,
  ContainerNavMask,
} from './primitives';
import type {
  DrawerGatewayProps,
  LayoutManagerProps,
  WrappedLayoutManagerProps,
} from './types';

import { GLOBAL_NAV_WIDTH } from '../../common/constants';

const DrawerGateway = ({ innerRef, ...props }: DrawerGatewayProps) => (
  <div ref={innerRef} {...props} />
);

class LayoutManager extends Component<LayoutManagerProps> {
  productNavRef: HTMLElement;
  pageRef: HTMLElement;
  static childContextTypes = {
    defaultDrawerIcon: PropTypes.func,
  };

  getChildContext() {
    return { defaultDrawerIcon: this.props.defaultDrawerIcon };
  }

  renderGlobalNav(isTransitioning) {
    const { navigation, globalNavigation: GlobalNavigation } = this.props;
    const { isPeeking, productNavIsCollapsed } = navigation.state;
    const displayShadow =
      productNavIsCollapsed && !isPeeking && !isTransitioning;
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

  renderResizeManager() {
    const { navigation } = this.props;
    const {
      isResizing,
      productNavIsCollapsed,
      productNavWidth,
    } = navigation.state;

    return (
      <ResizeTransition
        in={!productNavIsCollapsed}
        isDisabled={isResizing}
        properties={['width']}
        from={[0]}
        to={[productNavWidth]}
      >
        {({ isTransitioning, style: wrapperStyle, transitionState }) => {
          const isVisible = transitionState !== 'exited';
          const disableInteraction = isResizing || isTransitioning;

          return (
            <Fragment>
              <ResizeControl
                navigation={navigation}
                mutationRefs={[
                  { ref: this.pageRef, property: 'padding-left' },
                  { ref: this.productNavRef, property: 'width' },
                ]}
              >
                {resizeState => (
                  <ContainerNavMask>
                    {this.renderGlobalNav(isTransitioning)}
                    {this.renderProductNav({
                      disableInteraction,
                      isVisible,
                      resizeState,
                      transitionState,
                      wrapperStyle,
                    })}
                  </ContainerNavMask>
                )}
              </ResizeControl>
            </Fragment>
          );
        }}
      </ResizeTransition>
    );
  }

  renderProductNav({
    isVisible,
    disableInteraction,
    resizeState,
    transitionState,
    wrapperStyle,
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
        style={wrapperStyle}
      >
        {isVisible ? (
          <ProductNav
            container={productContainerNavigation}
            key="product-nav"
            isHinting={isHinting}
            isPeeking={isPeeking}
            resizeState={resizeState}
            transitionState={transitionState}
            onOverlayClick={navigation.unPeek}
            root={productRootNavigation}
          />
        ) : null}
      </ProductNavWrapper>
    );
  }
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
          <NavContainer>{this.renderResizeManager()}</NavContainer>
          <ResizeTransition
            in={!productNavIsCollapsed}
            isDisabled={isResizing}
            properties={['paddingLeft']}
            from={[0]}
            to={[productNavWidth]}
          >
            {({ isTransitioning, style }) => (
              <PageWrapper
                innerRef={this.getPageRef}
                offset={GLOBAL_NAV_WIDTH}
                disableInteraction={isResizing || isTransitioning}
                style={style}
              >
                {this.props.children}
              </PageWrapper>
            )}
          </ResizeTransition>
        </LayoutContainer>
        <DrawerGateway innerRef={navigation.getDrawerGateway} />
      </Fragment>
    );
  }
}

export default (props: WrappedLayoutManagerProps) => (
  <NavigationSubscriber>
    {navigation => <LayoutManager navigation={navigation} {...props} />}
  </NavigationSubscriber>
);
