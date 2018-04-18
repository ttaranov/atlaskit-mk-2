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

  renderResizeManager() {
    const { navigation } = this.props;
    const {
      isResizing,
      productNavIsCollapsed,
      productNavWidth,
    } = navigation.state;

    return (
      <ResizeTransition
        from={[0]}
        in={!productNavIsCollapsed}
        properties={['width']}
        to={[productNavWidth]}
        userIsDragging={isResizing}
      >
        {({ transitionStyle, transitionState }) => {
          const isVisible = transitionState !== 'exited';
          const activeTransition = isTransitioning(transitionState);
          const disableInteraction = isResizing || activeTransition;

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
                    {this.renderGlobalNav(activeTransition)}
                    {this.renderProductNav({
                      disableInteraction,
                      isVisible,
                      resizeState,
                      transitionState,
                      transitionStyle,
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
    transitionStyle,
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
            from={[0]}
            in={!productNavIsCollapsed}
            properties={['paddingLeft']}
            to={[productNavWidth]}
            userIsDragging={isResizing}
          >
            {({ transitionStyle, transitionState }) => {
              const activeTransition = isTransitioning(transitionState);
              return (
                <PageWrapper
                  innerRef={this.getPageRef}
                  offset={GLOBAL_NAV_WIDTH}
                  disableInteraction={isResizing || activeTransition}
                  style={transitionStyle}
                >
                  {this.props.children}
                </PageWrapper>
              );
            }}
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
