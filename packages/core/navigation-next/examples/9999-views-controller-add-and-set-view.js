// @flow

import React, { Component } from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import IssueIcon from '@atlaskit/icon/glyph/issue';
import PortfolioIcon from '@atlaskit/icon/glyph/portfolio';
import { JiraIcon, JiraWordmark } from '@atlaskit/logo';
import {
  LayoutManagerWithViewController,
  NavigationProvider,
  ViewController,
  withNavigationViewController,
} from '../src';

const MyGlobalNavigation = () => (
  <GlobalNavigation
    productIcon={() => <JiraIcon size="medium" />}
    onProductClick={() => {}}
  />
);

const productHomeView = {
  id: 'product/home',
  type: 'product',
  getItems: () => [
    {
      type: 'Section',
      id: 'product/home:header',
      items: [
        {
          type: () => (
            <div css={{ padding: '16px 0' }}>
              <JiraWordmark />
            </div>
          ),
          id: 'jira-wordmark',
        },
      ],
    },
    {
      type: 'Section',
      id: 'product/home:menu',
      items: [
        {
          type: 'Item',
          id: 'dashboards',
          before: DashboardIcon,
          text: 'Dashboards',
        },
        { type: 'Item', id: 'projects', before: FolderIcon, text: 'Projects' },
        {
          type: 'Item',
          id: 'issues-and-filters',
          before: IssueIcon,
          text: 'Issues and filters',
        },
        {
          type: 'Item',
          id: 'portfolio',
          before: PortfolioIcon,
          text: 'Portfolio',
        },
      ],
    },
  ],
};

class App extends Component<{
  navigationViewController: ViewController,
}> {
  componentDidMount() {
    const { navigationViewController } = this.props;
    navigationViewController.addView(productHomeView);
    navigationViewController.setView(productHomeView.id);
  }

  render() {
    return (
      <LayoutManagerWithViewController globalNavigation={MyGlobalNavigation}>
        <div>Page content goes here.</div>
      </LayoutManagerWithViewController>
    );
  }
}
const AppWithNavigationViewController = withNavigationViewController(App);

export default () => (
  <NavigationProvider>
    <AppWithNavigationViewController />
  </NavigationProvider>
);
