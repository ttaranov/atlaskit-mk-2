// @flow

import React, { Component } from 'react';
import { JiraWordmark as JiraWordmarkLogo } from '@atlaskit/logo';

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
          <NavRenderer customComponents={{ JiraWordmark }} items={data.view} />
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
