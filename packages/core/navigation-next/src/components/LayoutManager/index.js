// @flow

import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { ThemeProvider } from 'emotion-theming';

import { withNavigationState } from '../../state';
import { light } from '../../theme';
import ProductNav from '../ProductNav';
import Transition from './Transition';
import ResizeControl from './ResizeControl';
import { LayoutContainer, NavContainer } from './primitives';
import type { DrawerGatewayProps, LayoutManagerProps } from './types';

import { GLOBAL_NAV_WIDTH } from '../GlobalNav';

const DrawerGateway = ({ innerRef, ...props }: DrawerGatewayProps) => (
  <div ref={innerRef} {...props} />
);

class LayoutManager extends Component<LayoutManagerProps> {
  static childContextTypes = {
    defaultDrawerIcon: PropTypes.func,
  };

  getChildContext() {
    return { defaultDrawerIcon: this.props.defaultDrawerIcon };
  }

  renderGlobalNav() {
    const { navigation, globalNavigation: GlobalNavigation } = this.props;
    return (
      <ThemeProvider
        theme={theme => ({
          mode: light, // If no theme exists default to light mode
          ...theme,
          context: navigation.state.productNavIsCollapsed
            ? 'collapsed'
            : 'expanded',
        })}
      >
        <GlobalNavigation navigation={navigation} />
      </ThemeProvider>
    );
  }

  renderProductNav() {
    const {
      navigation,
      productRootNavigation,
      productContainerNavigation,
    } = this.props;
    const {
      isPeeking,
      isResizing,
      productNavIsCollapsed,
      productNavWidth,
    } = navigation.state;

    const width = !productNavIsCollapsed ? productNavWidth : 0;

    return (
      <Transition isEnabled={!isResizing} keys={['width']} values={[width]}>
        {({ isTransitioning }) =>
          width || isTransitioning ? (
            <ProductNav
              container={productContainerNavigation}
              isPeeking={isPeeking}
              isResizing={isResizing || isTransitioning}
              onOverlayClick={navigation.unPeek}
              root={productRootNavigation}
            />
          ) : null
        }
      </Transition>
    );
  }

  render() {
    const { navigation } = this.props;
    const { productNavIsCollapsed, productNavWidth } = navigation.state;
    const pageOffset = productNavIsCollapsed
      ? GLOBAL_NAV_WIDTH
      : productNavWidth + GLOBAL_NAV_WIDTH;

    return (
      <Fragment>
        <LayoutContainer>
          <NavContainer>
            {this.renderGlobalNav()}
            {this.renderProductNav()}
            <ResizeControl navigation={navigation} />
          </NavContainer>
          <Transition
            isEnabled={!navigation.state.isResizing}
            keys={['paddingLeft']}
            values={[pageOffset]}
            jss={{ flex: 1 }}
          >
            {() => this.props.children}
          </Transition>
        </LayoutContainer>
        <DrawerGateway innerRef={navigation.getDrawerGateway} />
      </Fragment>
    );
  }
}

export default withNavigationState(LayoutManager);
