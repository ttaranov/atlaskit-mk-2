// @flow

import React, {
  Component,
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
} from '../../../../package.json';
import ResizeTransition, {
  isTransitioning,
  type TransitionState,
} from './ResizeTransition';
import ResizeControl from './ResizeControl';
import Navigation from './Navigation';
import {
  ContainerNavigationMask,
  LayoutContainer,
  NavigationContainer,
  PageWrapper,
} from './primitives';
import type { LayoutManagerProps, CollapseListeners } from './types';

import {
  CONTENT_NAV_WIDTH_COLLAPSED,
  CONTENT_NAV_WIDTH_FLYOUT,
  GLOBAL_NAV_WIDTH,
  FLYOUT_DELAY,
} from '../../../common/constants';

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

type PageProps = CollapseListeners & {
  children: Node,
  flyoutIsOpen: boolean,
  innerRef: Ref<'div'>,
  isResizing: boolean,
  isCollapsed: boolean,
  productNavWidth: number,
};

// FIXME: Move to separate file
// eslint-disable-next-line react/no-multi-comp
class PageInner extends PureComponent<{ children: Node }> {
  componentDidMount() {
    console.log('Page Inner component mounted');
    // debugger; //eslint-disable-line
  }

  render() {
    return this.props.children;
  }
}

// FIXME: Move to separate file
// eslint-disable-next-line react/no-multi-comp
class Page extends PureComponent<PageProps> {
  componentDidMount() {
    console.log('Page component mounted');
    // debugger; //eslint-disable-line
  }
  render() {
    const {
      flyoutIsOpen,
      innerRef,
      isResizing,
      isCollapsed,
      productNavWidth,
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
    } = this.props;
    return (
      <ResizeTransition
        from={[CONTENT_NAV_WIDTH_COLLAPSED]}
        in={!isCollapsed}
        productNavWidth={productNavWidth}
        properties={['paddingLeft']}
        to={[flyoutIsOpen ? CONTENT_NAV_WIDTH_FLYOUT : productNavWidth]}
        userIsDragging={isResizing}
        /* Attach expand/collapse callbacks to the page resize transition to ensure they are only
         * called when the nav is permanently expanded/collapsed, i.e. when page content position changes. */
        onExpandStart={onExpandStart}
        onExpandEnd={onExpandEnd}
        onCollapseStart={onCollapseStart}
        onCollapseEnd={onCollapseEnd}
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
  state = {
    flyoutIsOpen: false,
    mouseIsOverNavigation: false,
    renderNavigation: false,
  };
  productNavRef: HTMLElement;
  pageRef: HTMLElement;
  containerRef: HTMLElement;
  flyoutMouseOverTimeout: TimeoutID;

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
    setTimeout(() => this.setState({ renderNavigation: true }), 10000);
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

  getContainerRef = (ref: ElementRef<*>) => {
    this.containerRef = ref;
  };
  getNavRef = (ref: ElementRef<*>) => {
    this.productNavRef = ref;
  };
  getPageRef = (ref: ElementRef<*>) => {
    this.pageRef = ref;
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
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
      containerNavigation,
      globalNavigation,
      experimental_flyoutOnHover,
      productNavigation,
    } = this.props;
    const { flyoutIsOpen, renderNavigation } = this.state;
    const {
      isResizing,
      isCollapsed,
      productNavWidth,
    } = navigationUIController.state;

    return (
      <LayoutContainer>
        <Navigation
          containerNavigation={containerNavigation}
          globalNavigation={globalNavigation}
          productNavigation={productNavigation}
          navigationUIController={navigationUIController}
          experimental_flyoutOnHover={experimental_flyoutOnHover}
          expandCollapseAffordance={this.nodeRefs.expandCollapseAffordance}
        />
        <Page
          flyoutIsOpen={flyoutIsOpen}
          innerRef={this.getPageRef}
          isResizing={isResizing}
          isCollapsed={isCollapsed}
          productNavWidth={productNavWidth}
          onExpandStart={onExpandStart}
          onExpandEnd={onExpandEnd}
          onCollapseStart={onCollapseStart}
          onCollapseEnd={onCollapseEnd}
        >
          {this.props.children}
        </Page>
      </LayoutContainer>
    );
  }
}
