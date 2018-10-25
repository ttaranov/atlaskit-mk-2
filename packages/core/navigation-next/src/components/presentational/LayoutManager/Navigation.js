// @flow

import React, { Component, Fragment } from 'react';

import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import {
  ContainerNavigationMask,
  ContentNavigationWrapper,
  NavigationContainer,
} from './primitives';
import { Shadow } from '../../../common/primitives';
import { light, ThemeProvider } from '../../../theme';
import ContentNavigation from './ContentNavigation';
import ResizeControl from './ResizeControl';
import ResizeTransition, {
  isTransitioning,
  type TransitionState,
} from './ResizeTransition';
import { colors } from '@atlaskit/theme';

import {
  name as packageName,
  version as packageVersion,
} from '../../../../package.json';

import {
  CONTENT_NAV_WIDTH_COLLAPSED,
  CONTENT_NAV_WIDTH_FLYOUT,
  GLOBAL_NAV_WIDTH,
  FLYOUT_DELAY,
} from '../../../common/constants';

type State = {
  flyoutIsOpen: boolean,
  mouseIsOverNavigation: boolean,
};

function defaultTooltipContent(isCollapsed: boolean) {
  return isCollapsed
    ? { text: 'Expand', char: '[' }
    : { text: 'Collapse', char: '[' };
}

export default class Navigation extends Component<{}, State> {
  state = { flyoutIsOpen: false, mouseIsOverNavigation: false };

  static defaultProps = {
    collapseToggleTooltipContent: defaultTooltipContent,
    experimental_flyoutOnHover: false,
  };

  renderGlobalNavigation = () => {
    const {
      containerNavigation,
      globalNavigation: GlobalNavigation,
    } = this.props;
    return (
      <ThemeProvider
        theme={theme => ({
          mode: light, // If no theme already exists default to light mode
          ...theme,
        })}
      >
        <Fragment>
          <Shadow
            isBold={!!containerNavigation}
            isOverDarkBg
            style={{ marginLeft: GLOBAL_NAV_WIDTH }}
          />
          <GlobalNavigation />
        </Fragment>
      </ThemeProvider>
    );
  };

  renderContentNavigation = (args: RenderContentNavigationArgs) => {
    const { transitionState, transitionStyle } = args;
    const {
      containerNavigation,
      experimental_flyoutOnHover,
      navigationUIController,
      productNavigation,
    } = this.props;
    const {
      isCollapsed,
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
        <ContentNavigation
          container={containerNavigation}
          isPeekHinting={isPeekHinting}
          isPeeking={isPeeking}
          isVisible={isVisible}
          key="product-nav"
          product={productNavigation}
        />
        {isCollapsed && !experimental_flyoutOnHover ? (
          <div
            aria-label="Click to expand the navigation"
            role="button"
            onClick={navigationUIController.expand}
            css={{
              cursor: 'pointer',
              height: '100%',
              outline: 0,
              position: 'absolute',
              transition: 'background-color 100ms',
              width: CONTENT_NAV_WIDTH_COLLAPSED,

              ':hover': {
                backgroundColor: containerNavigation
                  ? colors.N30
                  : 'rgba(255, 255, 255, 0.08)',
              },
              ':active': {
                backgroundColor: colors.N40A,
              },
            }}
            tabIndex="0"
          />
        ) : null}
      </ContentNavigationWrapper>
    );
  };

  mouseOutFlyoutArea = ({ currentTarget, relatedTarget }: *) => {
    if (currentTarget.contains(relatedTarget)) return;
    clearTimeout(this.flyoutMouseOverTimeout);
    this.setState({ flyoutIsOpen: false });
  };
  mouseOverFlyoutArea = ({ currentTarget, target }: *) => {
    if (!currentTarget.contains(target)) return;
    clearTimeout(this.flyoutMouseOverTimeout);

    this.flyoutMouseOverTimeout = setTimeout(() => {
      this.setState({ flyoutIsOpen: true });
    }, FLYOUT_DELAY);
  };

  mouseEnter = () => {
    this.setState({ mouseIsOverNavigation: true });
  };
  mouseLeave = () => {
    clearTimeout(this.flyoutMouseOverTimeout);
    this.setState({ mouseIsOverNavigation: false });
  };

  render() {
    const {
      navigationUIController,
      experimental_flyoutOnHover,
      expandCollapseAffordance,
    } = this.props;
    const { flyoutIsOpen, mouseIsOverNavigation } = this.state;
    const {
      isCollapsed,
      isResizeDisabled,
      isResizing,
      productNavWidth,
    } = navigationUIController.state;

    return (
      <NavigationAnalyticsContext
        data={{
          attributes: {
            isExpanded: !isCollapsed,
            flyoutOnHoverEnabled: experimental_flyoutOnHover,
          },
          componentName: 'navigation',
          packageName,
          packageVersion,
        }}
      >
        <ResizeTransition
          from={[CONTENT_NAV_WIDTH_COLLAPSED]}
          in={!isCollapsed || flyoutIsOpen}
          properties={['width']}
          to={[flyoutIsOpen ? CONTENT_NAV_WIDTH_FLYOUT : productNavWidth]}
          userIsDragging={isResizing}
          // only apply listeners to the NAV resize transition
          productNavWidth={productNavWidth}
        >
          {({ transitionStyle, transitionState }) => {
            const onMouseOut =
              isCollapsed && experimental_flyoutOnHover && flyoutIsOpen
                ? this.mouseOutFlyoutArea
                : null;
            return (
              <NavigationContainer
                innerRef={this.getContainerRef}
                onMouseEnter={this.mouseEnter}
                onMouseOut={onMouseOut}
                onMouseLeave={this.mouseLeave}
              >
                <ResizeControl
                  collapseToggleTooltipContent={
                    // $FlowFixMe
                    this.props.collapseToggleTooltipContent
                  }
                  expandCollapseAffordanceRef={expandCollapseAffordance}
                  experimental_flyoutOnHover={experimental_flyoutOnHover}
                  isDisabled={isResizeDisabled}
                  flyoutIsOpen={flyoutIsOpen}
                  mouseIsOverNavigation={mouseIsOverNavigation}
                  mutationRefs={[
                    { ref: this.pageRef, property: 'padding-left' },
                    { ref: this.productNavRef, property: 'width' },
                  ]}
                  navigation={navigationUIController}
                >
                  {({ isDragging, width }) => {
                    const onMouseOver =
                      isCollapsed && experimental_flyoutOnHover && !flyoutIsOpen
                        ? this.mouseOverFlyoutArea
                        : null;
                    return (
                      <ContainerNavigationMask onMouseOver={onMouseOver}>
                        {this.renderGlobalNavigation()}
                        {this.renderContentNavigation({
                          isDragging,
                          transitionState,
                          transitionStyle,
                          width,
                        })}
                      </ContainerNavigationMask>
                    );
                  }}
                </ResizeControl>
              </NavigationContainer>
            );
          }}
        </ResizeTransition>
      </NavigationAnalyticsContext>
    );
  }
}
