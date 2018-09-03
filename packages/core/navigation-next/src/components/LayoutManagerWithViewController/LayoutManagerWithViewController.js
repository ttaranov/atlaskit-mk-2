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
import {
  ProductNavigationTheme,
  ContainerNavigationTheme,
} from '../ContentNavigation/primitives';

const gridSize = gridSizeFn();

class LayoutManagerWithViewControllerBase extends Component<
  LayoutManagerWithViewControllerProps,
  LayoutManagerWithViewControllerState,
> {
  state = {
    hasInitialised: false,
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

  renderSkeleton = () => {
    const { firstSkeleton } = this.props;
    let Wrapper;

    if (firstSkeleton === 'product' && !this.state.hasInitialised) {
      Wrapper = ProductNavigationTheme;
    } else if (firstSkeleton === 'container' && !this.state.hasInitialised) {
      Wrapper = ContainerNavigationTheme;
    } else {
      Wrapper = Fragment;
    }

    return (
      <Wrapper>
        <div css={{ padding: `${gridSize * 2}px 0` }}>
          <Section>
            {({ className }) => (
              <div className={className}>
                <SkeletonContainerHeader hasBefore />
              </div>
            )}
          </Section>
          <Section>
            {({ className }) => (
              <div className={className}>
                <SkeletonItem hasBefore />
                <SkeletonItem hasBefore />
                <SkeletonItem hasBefore />
                <SkeletonItem hasBefore />
                <SkeletonItem hasBefore />
              </div>
            )}
          </Section>
        </div>
      </Wrapper>
    );
  };

  renderContainerNavigation = () => {
    const {
      navigationViewController: {
        state: { activeView },
      },
      firstSkeleton,
    } = this.props;

    if (activeView && activeView.type === 'container') {
      return this.renderView(activeView);
    }

    if (
      !activeView &&
      firstSkeleton === 'container' &&
      !this.state.hasInitialised
    ) {
      return this.renderSkeleton();
    }

    return firstSkeleton !== 'container' ? null : this.renderSkeleton();
  };

  renderGlobalNavigation = () => {
    const {
      globalNavigation: GlobalNavigation,
      navigationViewController: {
        state: { activeView },
      },
    } = this.props;
    const { hasInitialised } = this.state;

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
    } = this.props;

    if (
      activePeekView &&
      (isPeeking || (activeView && activeView.type === 'container'))
    ) {
      return this.renderView(activePeekView);
    }
    if (activeView && activeView.type === 'product') {
      return this.renderView(activeView);
    }

    return this.renderSkeleton();
  };

  renderView(view) {
    const { customComponents } = this.props;
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

    return (
      <NavigationAnalyticsContext
        data={{ attributes: { view: activeView && activeView.id } }}
      >
        <LayoutManager
          globalNavigation={this.renderGlobalNavigation}
          containerNavigation={
            (activeView && activeView.type === 'container') ||
            (!activeView &&
              firstSkeleton === 'container' &&
              !this.state.hasInitialised)
              ? this.renderContainerNavigation
              : null
          }
          productNavigation={this.renderProductNavigation}
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
