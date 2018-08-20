// @flow
/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';
import { HashRouter, Link, Route, Switch } from 'react-router-dom';
import GlobalNavigation from '@atlaskit/global-navigation';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import ComponentIcon from '@atlaskit/icon/glyph/component';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import IssueIcon from '@atlaskit/icon/glyph/issue';
import PageIcon from '@atlaskit/icon/glyph/page';
import PortfolioIcon from '@atlaskit/icon/glyph/portfolio';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import { JiraIcon, JiraWordmark } from '@atlaskit/logo';
import {
  ItemAvatar,
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

const LinkItem = ({ components: { Item }, to, ...props }: *) => {
  return (
    <Route
      render={({ location: { pathname } }) => (
        <Item
          component={({ children, className }) => (
            <Link className={className} to={to}>
              {children}
            </Link>
          )}
          isSelected={pathname === to}
          {...props}
        />
      )}
    />
  );
};

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
      nestedGroupKey: 'menu',
      id: 'product/home:menu',
      parentId: null,
      items: [
        {
          type: LinkItem,
          id: 'dashboards',
          before: DashboardIcon,
          text: 'Dashboards',
          to: '/',
        },
        {
          type: 'Item',
          id: 'projects',
          before: FolderIcon,
          text: 'Projects',
        },
        {
          type: 'Item',
          id: 'issues-and-filters',
          goTo: 'product/issues',
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

const productIssuesView = {
  id: 'product/issues',
  type: 'product',
  getItems: () =>
    new Promise(resolve =>
      setTimeout(
        () =>
          resolve([
            {
              type: 'Section',
              id: 'product/issues:header',
              items: [
                {
                  type: () => (
                    <div css={{ padding: '16px 0' }}>
                      <JiraWordmark />
                    </div>
                  ),
                  id: 'jira-wordmark',
                },
                {
                  type: 'Item',
                  id: 'back-item',
                  after: null,
                  before: ArrowLeftIcon,
                  goTo: 'product/home',
                  text: 'Back',
                },
              ],
            },
            {
              type: 'Section',
              nestedGroupKey: 'menu',
              id: 'product/issues:menu',
              parentId: 'product/home:menu',
              items: [
                {
                  type: LinkItem,
                  text: 'Search issues',
                  to: '/issues',
                  id: 'search-issues',
                },
                { type: 'GroupHeading', id: 'other-heading', text: 'Other' },
                { type: 'Item', text: 'My open issues', id: 'my-open-issues' },
                { type: 'Item', text: 'Reported by me', id: 'reported-by-me' },
                { type: 'Item', text: 'All issues', id: 'all-issues' },
                { type: 'Item', text: 'Open issues', id: 'open-issues' },
                { type: 'Item', text: 'Done issues', id: 'done-issues' },
                {
                  type: 'Item',
                  text: 'Viewed recently',
                  id: 'viewed-recently',
                },
                {
                  type: 'Item',
                  text: 'Created recently',
                  id: 'created-recently',
                },
                {
                  type: 'Item',
                  text: 'Resolved recently',
                  id: 'resolved-recently',
                },
                {
                  type: 'Item',
                  text: 'Updated recently',
                  id: 'updated-recently',
                },
                { type: 'Separator', id: 'separator' },
                {
                  type: 'Item',
                  text: 'View all filters',
                  id: 'view-all-filters',
                },
              ],
            },
          ]),
        1000,
      ),
    ),
};

const projectHomeView = {
  id: 'project/home',
  type: 'container',
  getItems: () => [
    {
      type: 'Section',
      id: 'project/home:header',
      items: [
        {
          type: 'ContainerHeader',
          before: itemState => (
            <ItemAvatar itemState={itemState} appearance="square" />
          ),
          text: 'My project',
          subText: 'Project description',
          id: 'project-header',
        },
      ],
    },
    {
      type: 'Section',
      nestedGroupKey: 'menu',
      id: 'project/home:menu',
      parentId: null,
      items: [
        {
          type: LinkItem,
          before: BacklogIcon,
          text: 'Backlog',
          to: '/projects/my-project',
          id: 'backlog',
        },
        {
          type: 'Item',
          before: BoardIcon,
          text: 'Active sprints',
          id: 'active-sprints',
        },
        { type: 'Item', before: GraphLineIcon, text: 'Reports', id: 'reports' },
        { type: 'Separator', id: 'separator' },
        { type: 'Item', before: ShipIcon, text: 'Releases', id: 'releases' },
        {
          type: 'Item',
          before: IssueIcon,
          text: 'Issues and filters',
          id: 'issues-and-filters',
        },
        { type: 'Item', before: PageIcon, text: 'Pages', id: 'pages' },
        {
          type: 'Item',
          before: ComponentIcon,
          text: 'Components',
          id: 'components',
        },
      ],
    },
  ],
};

class DashboardsRouteBase extends Component<{
  navigationViewController: ViewController,
}> {
  componentDidMount() {
    const { navigationViewController } = this.props;
    navigationViewController.setView(productHomeView.id);
  }

  render() {
    return (
      <div>
        <h1>Dashboards</h1>
        <h3>Projects:</h3>
        <ul>
          <li>
            <Link to="/projects/my-project">My Project</Link>
          </li>
        </ul>
      </div>
    );
  }
}
const DashboardsRoute = withNavigationViewController(DashboardsRouteBase);

class IssuesAndFiltersRouteBase extends Component<{
  navigationViewController: ViewController,
}> {
  componentDidMount() {
    const { navigationViewController } = this.props;
    navigationViewController.setView(productIssuesView.id);
  }

  render() {
    return (
      <div>
        <h1>Issues and filters</h1>
      </div>
    );
  }
}
const IssuesAndFiltersRoute = withNavigationViewController(
  IssuesAndFiltersRouteBase,
);

class ProjectBacklogRouteBase extends Component<{
  navigationViewController: ViewController,
}> {
  componentDidMount() {
    const { navigationViewController } = this.props;
    navigationViewController.setView(projectHomeView.id);
  }

  render() {
    return (
      <div>
        <h1>My Project</h1>
        <p>
          <Link to="/">Back to Dashboards</Link>
        </p>
      </div>
    );
  }
}
const ProjectBacklogRoute = withNavigationViewController(
  ProjectBacklogRouteBase,
);

class App extends Component<{
  navigationViewController: ViewController,
}> {
  componentDidMount() {
    const { navigationViewController } = this.props;
    navigationViewController.addView(productHomeView);
    navigationViewController.addView(productIssuesView);
    navigationViewController.addView(projectHomeView);
    navigationViewController.setInitialPeekViewId(productHomeView.id);
  }

  render() {
    return (
      <LayoutManagerWithViewController globalNavigation={MyGlobalNavigation}>
        <Switch>
          <Route path="/projects/my-project" component={ProjectBacklogRoute} />
          <Route path="/issues" component={IssuesAndFiltersRoute} />
          <Route path="/" component={DashboardsRoute} />
        </Switch>
      </LayoutManagerWithViewController>
    );
  }
}
const AppWithNavigationViewController = withNavigationViewController(App);

export default () => (
  <HashRouter>
    <NavigationProvider>
      <AppWithNavigationViewController />
    </NavigationProvider>
  </HashRouter>
);
