// @flow

import React, {
  Component,
  Fragment,
  PureComponent,
  type ElementRef,
  type Ref,
  type Node,
} from 'react';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { colors } from '@atlaskit/theme';

import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';
import { Shadow } from '../../common/primitives';
import { light, ThemeProvider } from '../../theme';
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

import {
  CONTENT_NAV_WIDTH_COLLAPSED,
  CONTENT_NAV_WIDTH_FLYOUT,
  GLOBAL_NAV_WIDTH,
} from '../../common/constants';

type RenderContentNavigationArgs = {
  isDragging: boolean,
  transitionState: TransitionState,
  transitionStyle: Object,
  width: number,
};
type State = {
  flyoutIsOpen: boolean,
  mouseIsOverNavigation: boolean,
};

function defaultTooltipContent(isCollapsed: boolean) {
  return isCollapsed
    ? { text: 'Expand', char: '[' }
    : { text: 'Collapse', char: '[' };
}

type PageProps = {
  children: Node,
  flyoutIsOpen: boolean,
  innerRef: Ref<'div'>,
  isResizing: boolean,
  isCollapsed: boolean,
  productNavWidth: number,
};

// eslint-disable-next-line react/no-multi-comp
class PageInner extends PureComponent<{ children: Node }> {
  render() {
    return this.props.children;
  }
}

// eslint-disable-next-line react/no-multi-comp
class Page extends PureComponent<PageProps> {
  render() {
    const {
      flyoutIsOpen,
      innerRef,
      isResizing,
      isCollapsed,
      productNavWidth,
    } = this.props;
    return (
      <ResizeTransition
        from={[CONTENT_NAV_WIDTH_COLLAPSED]}
        in={!isCollapsed}
        productNavWidth={productNavWidth}
        properties={['paddingLeft']}
        to={[flyoutIsOpen ? CONTENT_NAV_WIDTH_FLYOUT : productNavWidth]}
        userIsDragging={isResizing}
      >
        {({ transitionStyle, transitionState }) => (
          <PageWrapper
            disableInteraction={isResizing || isTransitioning(transitionState)}
            innerRef={innerRef}
            offset={GLOBAL_NAV_WIDTH}
            style={transitionStyle}
          >
            <PageInner>{this.props.children}</PageInner>
          </PageWrapper>
        )}
      </ResizeTransition>
    );
  }
}

/* NOTE: experimental props use an underscore */
/* eslint-disable camelcase */

// eslint-disable-next-line react/no-multi-comp
export default class LayoutManager extends Component<
  LayoutManagerProps,
  State,
> {
  state = { flyoutIsOpen: false, mouseIsOverNavigation: false };
  productNavRef: HTMLElement;
  pageRef: HTMLElement;

  static defaultProps = {
    collapseToggleTooltipContent: defaultTooltipContent,
    experimental_flyoutOnHover: false,
  };
  static getDerivedStateFromProps(props: LayoutManagerProps, state: State) {
    // kill the flyout when the user commits to expanding navigation
    if (!props.navigationUIController.state.isCollapsed && state.flyoutIsOpen) {
      return { flyoutIsOpen: false };
    }

    return null;
  }

  nodeRefs = {
    expandCollapseAffordance: React.createRef(),
  };

  componentDidMount() {
    this.publishRefs();
  }

  componentDidUpdate() {
    this.publishRefs();
  }

  publishRefs() {
    const { getRefs } = this.props;
    if (typeof getRefs === 'function') {
      getRefs(this.nodeRefs);
    }
  }

  getNavRef = (ref: ElementRef<*>) => {
    this.productNavRef = ref;
  };
  getPageRef = (ref: ElementRef<*>) => {
    this.pageRef = ref;
  };

  openFlyout = () => {
    if (!this.props.navigationUIController.state.isCollapsed) {
      return;
    }

    this.setState({ flyoutIsOpen: true });
  };

  mouseEnter = () => {
    this.setState({ mouseIsOverNavigation: true });
  };
  mouseLeave = () => {
    this.setState({ flyoutIsOpen: false, mouseIsOverNavigation: false });
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

  renderNavigation = () => {
    const {
      navigationUIController,
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
      experimental_flyoutOnHover,
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
          attributes: { isExpanded: !isCollapsed },
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
          onExpandStart={onExpandStart}
          onExpandEnd={onExpandEnd}
          onCollapseStart={onCollapseStart}
          onCollapseEnd={onCollapseEnd}
        >
          {({ transitionStyle, transitionState }) => {
            return (
              <NavigationContainer
                onMouseEnter={this.mouseEnter}
                onMouseLeave={this.mouseLeave}
              >
                <ResizeControl
                  collapseToggleTooltipContent={
                    // $FlowFixMe
                    this.props.collapseToggleTooltipContent
                  }
                  expandCollapseAffordanceRef={
                    this.nodeRefs.expandCollapseAffordance
                  }
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
                    const onMouseEnter = experimental_flyoutOnHover
                      ? this.openFlyout
                      : null;
                    return (
                      <ContainerNavigationMask onMouseEnter={onMouseEnter}>
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
  };

  render() {
    const { navigationUIController } = this.props;
    const { flyoutIsOpen } = this.state;
    const {
      isResizing,
      isCollapsed,
      productNavWidth,
    } = navigationUIController.state;

    return (
      <LayoutContainer>
        {this.renderNavigation()}
        <Page
          flyoutIsOpen={flyoutIsOpen}
          innerRef={this.getPageRef}
          isResizing={isResizing}
          isCollapsed={isCollapsed}
          productNavWidth={productNavWidth}
        >
          {this.props.children}
        </Page>
      </LayoutContainer>
    );
  }
}
