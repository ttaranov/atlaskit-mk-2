// @flow

import React, { Component, Fragment } from 'react';
import { JiraWordmark as JiraWordmarkLogo } from '@atlaskit/logo';
import { Label } from '@atlaskit/field-base';
import Toggle from '@atlaskit/toggle';

import {
  GlobalNav,
  LayoutManager,
  NavAPISubscriber,
  NavigationProvider,
  NavRenderer,
} from '../src';

import {
  globalNavPrimaryItems,
  globalNavSecondaryItems,
  rootViews,
} from './shared/mock-data';
import ShortcutsPlugin from './shared/shortcuts-plugin';

/**
 * Render components
 */
const GlobalNavigation = () => (
  <GlobalNav
    primaryItems={globalNavPrimaryItems}
    secondaryItems={globalNavSecondaryItems}
  />
);

const JiraWordmark = () => (
  <div css={{ padding: '16px 0' }}>
    <JiraWordmarkLogo />
  </div>
);

const ProductRoot = () => (
  <NavAPISubscriber>
    {api => {
      const { activeView, data } = api.state;
      return activeView && data ? (
        <div css={{ padding: '16px 0' }}>
          <NavRenderer customComponents={{ JiraWordmark }} items={data} />
        </div>
      ) : (
        'LOADING'
      );
    }}
  </NavAPISubscriber>
);

class Example extends Component<*> {
  componentDidMount() {
    const { navAPI } = this.props;

    const rootViewKeys = Object.keys(rootViews);

    rootViewKeys.forEach(key => {
      navAPI.addView(key, () => rootViews[key]);
    });

    navAPI.setView(rootViewKeys[0]);
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
