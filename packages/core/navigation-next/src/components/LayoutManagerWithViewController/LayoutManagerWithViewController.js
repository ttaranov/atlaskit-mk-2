// @flow

import React, { Component } from 'react';
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import ViewRenderer from '../../renderer';
import { withNavigationUI } from '../../ui-controller';
import { withNavigationViewController } from '../../view-controller';
import LayoutManager from '../LayoutManager';
import Section from '../Section';
import SkeletonContainerHeader from '../SkeletonContainerHeader';
import SkeletonItem from '../SkeletonItem';
import type { LayoutManagerWithViewControllerProps } from './types';

const gridSize = gridSizeFn();

const skeleton = (
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
        </div>
      )}
    </Section>
  </div>
);

class LayoutManagerWithViewControllerBase extends Component<
  LayoutManagerWithViewControllerProps,
> {
  constructor(props: LayoutManagerWithViewControllerProps) {
    super(props);
    this.renderContainerNavigation.displayName = 'ContainerNavigationRenderer';
    this.renderProductNavigation.displayName = 'ProductNavigationRenderer';
  }
  renderContainerNavigation = () => {
    const {
      navigationViewController: {
        state: { activeView },
      },
    } = this.props;

    return activeView && activeView.type === 'container'
      ? this.renderView(activeView)
      : skeleton;
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
    return skeleton;
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
      globalNavigation,
      navigationViewController: {
        state: { activeView },
      },
    } = this.props;

    return (
      <LayoutManager
        globalNavigation={globalNavigation}
        containerNavigation={
          activeView && activeView.type === 'container'
            ? this.renderContainerNavigation
            : null
        }
        productNavigation={this.renderProductNavigation}
      >
        {children}
      </LayoutManager>
    );
  }
}
export default withNavigationUI(
  withNavigationViewController(LayoutManagerWithViewControllerBase),
);
