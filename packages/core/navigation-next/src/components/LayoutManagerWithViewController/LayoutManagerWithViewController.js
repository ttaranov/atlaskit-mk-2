// @flow

import React, { Component, Fragment } from 'react';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import ViewRenderer from '../../renderer';
import { withNavigationUI } from '../../ui-controller';
import { withNavigationViewController } from '../../view-controller';
import LayoutManager from '../LayoutManager';
import Section from '../Section';
import SkeletonContainerHeader from '../SkeletonContainerHeader';
import SkeletonItem from '../SkeletonItem';
import type {
  LayoutManagerWithViewControllerProps,
  LayoutManagerWithViewControllerState,
} from './types';
import LayerInitialised from './LayerInitialised';

const gridSize = gridSizeFn();

class LayoutManagerWithViewControllerBase extends Component<
  LayoutManagerWithViewControllerProps,
  LayoutManagerWithViewControllerState,
> {
  state = {
    hasInitialised: false,
    enableAnimationOnFirstLoad: false,
  };

  constructor(props: LayoutManagerWithViewControllerProps) {
    super(props);
    this.renderContainerNavigation.displayName = 'ContainerNavigationRenderer';
    this.renderProductNavigation.displayName = 'ProductNavigationRenderer';
  }

  onInitialised = () => {
    this.setState({
      hasInitialised: true,
    });
  };

  // shouldComponentUpdate(nextProps) {
  //   console.log(
  //     'LayoutManagerWithViewController: shouldComponentUpdate',
  //     nextProps,
  //   );
  //   return (
  //     nextProps.navigationUIController.state.isPeeking !==
  //       this.props.avigationUIController.state.isPeeking ||
  //     nextProps.navigationViewController.state.activeView !==
  //       this.props.navigationViewController.state.activeView ||
  //     nextProps.navigationViewController.state.activePeekView !==
  //       this.props.navigationViewController.state.activePeekView
  //   );
  // }

  componentDidMount() {
    this.setState({ enableAnimationOnFirstLoad: true });
  }

  renderSkeleton = () => {
    const {
      navigationViewController: {
        state: { activeView },
      },
    } = this.props;
    const { enableAnimationOnFirstLoad } = this.state;
    console.log(
      'LayoutManagerWithViewController: renderSkeleton',
      activeView,
      this.props,
    );
    return (
      <div css={{ padding: `${gridSize * 2}px 0`, border: '1px solid red' }}>
        <Section disableAnimation={enableAnimationOnFirstLoad}>
          {({ className }) => (
            <div className={className}>
              <SkeletonContainerHeader hasBefore />
            </div>
          )}
        </Section>
        <Section disableAnimation={enableAnimationOnFirstLoad}>
          {({ className }) => {
            return (
              <div className={className}>
                <SkeletonItem hasBefore />
                <SkeletonItem hasBefore />
                <SkeletonItem hasBefore />
                <SkeletonItem hasBefore />
                <SkeletonItem hasBefore />
              </div>
            );
          }}
        </Section>
      </div>
    );
  };

  renderContainerNavigation = () => {
    const {
      navigationViewController: {
        state: { activeView },
      },
      firstSkeleton,
    } = this.props;

    console.log(
      'LayoutManagerWithViewController: render container renderContainerNavigation',
      activeView,
      firstSkeleton,
      this.state,
    );
    // debugger; // eslint-disable-line

    if (
      [null, undefined, 'container'].includes(firstSkeleton) &&
      !this.state.enableAnimationOnFirstLoad
    ) {
      return this.renderSkeleton();
    }

    if (activeView && activeView.type === 'container') {
      return this.renderView(activeView);
    }

    return null;
  };

  renderGlobalNavigation = () => {
    const {
      globalNavigation: GlobalNavigation,
      navigationViewController: {
        state: { activeView },
      },
    } = this.props;
    const { hasInitialised } = this.state;
    console.log(
      'LayoutManagerWithViewController: renderGlobalNavigation',
      hasInitialised,
    );
    // // debugger; // eslint-disable-line
    /* We are embedding the LayerInitialised analytics component within global navigation so that
     * the event it fires can access the analytics context within LayerManager. The component
     * cannot be rendered directly within LayerManager since it needs access to view data which
     * only exists in LayoutManagerWithViewController. */
    return (
      <Fragment>
        <GlobalNavigation />
        <LayerInitialised
          activeView={activeView}
          initialised={hasInitialised}
          onInitialised={this.onInitialised}
        />
      </Fragment>
    );
  };

  renderProductNavigation = () => {
    const {
      navigationUIController: {
        state: { isPeeking },
      },
      navigationViewController: {
        state: { activeView, activePeekView },
      },
      firstSkeleton,
    } = this.props;
    console.log(
      'LayoutManagerWithViewController: renderProductNavigation',
      activeView,
      activePeekView,
    );
    // debugger; // eslint-disable-line

    if (
      [null, undefined, 'product'].includes(firstSkeleton) &&
      !this.state.enableAnimationOnFirstLoad
    ) {
      return this.renderSkeleton();
    }

    if (
      activePeekView &&
      (isPeeking || (activeView && activeView.type === 'container'))
    ) {
      return this.renderView(activePeekView);
    }
    if (activeView && activeView.type === 'product') {
      return this.renderView(activeView);
    }

    return null;
  };

  renderView(view) {
    const { customComponents } = this.props;
    console.log(
      'LayoutManagerWithViewController: renderView',
      view,
      customComponents,
    );
    return (
      <div css={{ padding: `${gridSize * 2}px 0` }}>
        <ViewRenderer customComponents={customComponents} items={view.data} />
      </div>
    );
  }

  render() {
    const {
      children,
      navigationViewController: {
        state: { activeView },
      },
      firstSkeleton,
    } = this.props;
    const { enableAnimationOnFirstLoad } = this.state;

    console.log(
      'LayoutManagerWithViewControllerBase RENDER: ',
      activeView,
      firstSkeleton,
    );
    // // debugger; // eslint-disable-line
    return (
      <NavigationAnalyticsContext
        data={{ attributes: { view: activeView && activeView.id } }}
      >
        <LayoutManager
          globalNavigation={this.renderGlobalNavigation}
          containerNavigation={this.renderContainerNavigation}
          productNavigation={this.renderProductNavigation}
          disableAnimation={enableAnimationOnFirstLoad}
          firstSkeleton={firstSkeleton}
        >
          {children}
        </LayoutManager>
      </NavigationAnalyticsContext>
    );
  }
}
export default withNavigationUI(
  withNavigationViewController(LayoutManagerWithViewControllerBase),
);
