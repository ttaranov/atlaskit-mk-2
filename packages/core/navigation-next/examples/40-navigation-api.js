// @flow

import React, { Component, Fragment } from 'react';
import { Label } from '@atlaskit/field-base';
import Toggle from '@atlaskit/toggle';

// import UNSTATED from 'unstated-debug';
import ShortcutsPlugin from './shared/shortcuts-plugin';

import {
  GlobalNav,
  LayoutManager,
  NavAPISubscriber,
  NavigationProvider,
} from '../src';

import * as components from './shared/components';
import {
  globalNavPrimaryItems,
  globalNavSecondaryItems,
  rootViews,
} from './shared/mock-data';

const { ViewRenderer } = components;

/**
 * Render components
 */
const GlobalNavigation = () => (
  <GlobalNav
    primaryItems={globalNavPrimaryItems}
    secondaryItems={globalNavSecondaryItems}
  />
);

const ProductRoot = () => (
  <NavAPISubscriber>
    {api => {
      const { activeView, data } = api.state;
      return activeView && data ? <ViewRenderer view={data.view} /> : 'LOADING';
    }}
  </NavAPISubscriber>
);

class Example extends Component<*> {
  componentDidMount() {
    const { navAPI } = this.props;

    rootViews.forEach(view => {
      navAPI.addView(view.id, () => view);
    });

    navAPI.setView(rootViews[0].id);
  }
  render() {
    const { onDebugToggle } = this.props;
    return (
      <LayoutManager
        globalNavigation={GlobalNavigation}
        productRootNavigation={ProductRoot}
        productContainerNavigation={null}
      >
        <div style={{ padding: 30 }}>Page content</div>
        <Label label="Toggle debug logger" />
        <Toggle isDefaultChecked onChange={onDebugToggle} />
      </LayoutManager>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
export default class extends Component<*, *> {
  state = {
    debugEnabled: true,
  };

  toggleDebug = () => {
    this.setState({
      debugEnabled: !this.state.debugEnabled,
    });
  };

  render() {
    const { debugEnabled } = this.state;
    return (
      <NavigationProvider debug={debugEnabled}>
        <Fragment>
          <NavAPISubscriber>
            {api => <Example navAPI={api} onDebugToggle={this.toggleDebug} />}
          </NavAPISubscriber>
          <ShortcutsPlugin />
        </Fragment>
      </NavigationProvider>
    );
  }
}
