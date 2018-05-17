// @flow

import React, { Component } from 'react';

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
    return (
      <LayoutManager
        globalNavigation={GlobalNavigation}
        productRootNavigation={ProductRoot}
        productContainerNavigation={null}
      >
        <div style={{ padding: 30 }}>Page content</div>
      </LayoutManager>
    );
  }
}

export default () => (
  <NavigationProvider>
    <NavAPISubscriber>{api => <Example navAPI={api} />}</NavAPISubscriber>
  </NavigationProvider>
);
