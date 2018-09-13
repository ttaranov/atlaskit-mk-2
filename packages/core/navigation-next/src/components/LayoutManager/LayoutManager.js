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
  GLOBAL_NAV_WIDTH,
} from '../../common/constants';

type RenderContentNavigationArgs = {
  isDragging: boolean,
  transitionState: TransitionState,
  transitionStyle: Object,
  width: number,
};
type State = {
  mouseIsOverNavigation: boolean,
};

function defaultTooltipContent(isCollapsed: boolean) {
  return isCollapsed
    ? { text: 'Expand', char: '[' }
    : { text: 'Collapse', char: '[' };
}

type PageProps = {
  children: Node,
  innerRef: Ref<'div'>,
  isResizing: boolean,
  isCollapsed: boolean,
  productNavWidth: number,
};

// eslint-disable-next-line
class PageInner extends PureComponent<{ children: Node }> {
  render() {
    return this.props.children;
  }
}

// eslint-disable-next-line
class Page extends PureComponent<PageProps> {
  render() {
    const { innerRef, isResizing, isCollapsed, productNavWidth } = this.props;
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

// eslint-disable-next-line
export default class LayoutManager extends Component<
  LayoutManagerProps,
  State,
> {
  state = { mouseIsOverNavigation: false };
  productNavRef: HTMLElement;
  pageRef: HTMLElement;

  static defaultProps = {
    collapseToggleTooltipContent: defaultTooltipContent,
  };

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

  mouseEnter = () => {
    this.setState({ mouseIsOverNavigation: true });
  };
  mouseLeave = () => {
    this.setState({ mouseIsOverNavigation: false });
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
        {isCollapsed ? (
          <div
            aria-label="Click to expand the navigation"
            role="button"
            onClick={navigationUIController.expand}
            style={{
              cursor: 'pointer',
              height: '100%',
              position: 'absolute',
              outline: 0,
              width: CONTENT_NAV_WIDTH_COLLAPSED,
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
    } = this.props;
    const {
      isCollapsed,
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
                  mouseIsOverNavigation={this.state.mouseIsOverNavigation}
                  mutationRefs={[
                    { ref: this.pageRef, property: 'padding-left' },
                    { ref: this.productNavRef, property: 'width' },
                  ]}
                  navigation={navigationUIController}
                >
                  {({ isDragging, width }) => (
                    <ContainerNavigationMask>
                      {this.renderGlobalNavigation()}
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

  render() {
    const { navigationUIController } = this.props;
    const {
      isResizing,
      isCollapsed,
      productNavWidth,
    } = navigationUIController.state;

    return (
      <LayoutContainer>
        {this.renderNavigation()}
        <Page
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
