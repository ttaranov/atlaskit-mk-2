// @flow

import React, { Fragment } from 'react';
import { HashRouter, Link, Route, Switch } from 'react-router-dom';
import GlobalNavigation from '@atlaskit/global-navigation';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import { AtlassianWordmark } from '@atlaskit/logo';
import {
  Item,
  LayoutManager,
  NavigationProvider,
  NavigationSubscriber,
  NavRenderer,
  RootViewSubscriber,
  ContainerViewSubscriber,
} from '../../src';

import RootViews from './views/root';
import { ProjectSwitcher } from './pages/components';
import { HomePage, ProjectPage, ProjectsPage, SettingsPage } from './pages';

const MyGlobalNavigation = () => (
  <NavigationSubscriber>
    {({ togglePeek }) => (
      <GlobalNavigation
        productIcon={AtlassianIcon}
        onProductClick={togglePeek}
      />
    )}
  </NavigationSubscriber>
);

const ProductNavigationWrapper = props => (
  <div style={{ padding: 16 }} {...props} />
);

const Wordmark = () => (
  <div style={{ padding: '8px 0' }}>
    <AtlassianWordmark />
  </div>
);

const LinkItem = ({ to, ...props }: *) => (
  <Item
    component={({ className, children }) => (
      <Link to={to} className={className}>
        {children}
      </Link>
    )}
    {...props}
  />
);

const MyProductNavigation = () => (
  <ProductNavigationWrapper>
    <RootViewSubscriber>
      {({ state: { data } }) =>
        data ? (
          <NavRenderer
            items={data}
            customComponents={{ LinkItem, ProjectSwitcher, Wordmark }}
          />
        ) : (
          'LOADING'
        )
      }
    </RootViewSubscriber>
  </ProductNavigationWrapper>
);

const MyContainerView = () => (
  <ProductNavigationWrapper>
    <ContainerViewSubscriber>
      {({ state: { data } }) =>
        data ? (
          <NavRenderer
            items={data}
            customComponents={{ LinkItem, ProjectSwitcher, Wordmark }}
          />
        ) : (
          'LOADING'
        )
      }
    </ContainerViewSubscriber>
  </ProductNavigationWrapper>
);

export default () => (
  <HashRouter hashType="slash">
    <NavigationProvider>
      <Fragment>
        <RootViews />
        <ContainerViewSubscriber>
          {containerView => (
            <LayoutManager
              globalNavigation={MyGlobalNavigation}
              productRootNavigation={MyProductNavigation}
              productContainerNavigation={
                containerView.state.activeView ? MyContainerView : null
              }
            >
              <Switch>
                <Route
                  path="/projects/:projectId"
                  render={({ match }) => (
                    <ProjectPage projectId={match.params.projectId} />
                  )}
                />
                <Route path="/projects" component={ProjectsPage} />
                <Route path="/settings" component={SettingsPage} />
                <Route path="/" component={HomePage} />
              </Switch>
            </LayoutManager>
          )}
        </ContainerViewSubscriber>
      </Fragment>
    </NavigationProvider>
  </HashRouter>
);
