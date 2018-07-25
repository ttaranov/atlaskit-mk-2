// @flow

import React, { Component } from 'react';
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import ViewRenderer from '../../renderer';
import { withNavigationUIController } from '../../ui-controller';
import { withNavigationViewController } from '../../view-controller';
import LayoutManager from '../LayoutManager';
import type { LayoutManagerWithViewsProps } from './types';

const gridSize = gridSizeFn();

class LayoutManagerWithViewsBase extends Component<
  LayoutManagerWithViewsProps,
> {
  renderContainerNavigation = () => {
    const {
      navigationViewController: {
        state: { activeView },
      },
    } = this.props;

    return activeView && activeView.type === 'container'
      ? this.renderView(activeView)
      : 'Container skeleton goes here.';
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
    return 'Product skeleton goes here.';
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
export default withNavigationUIController(
  withNavigationViewController(LayoutManagerWithViewsBase),
);
