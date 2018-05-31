// @flow

import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';

import {
  ContainerViewSubscriber,
  LayoutManager,
  NavigationProvider,
} from '../src';

import {
  DefaultGlobalNavigation,
  ProductContainer,
  ProductRoot,
} from './shared/components';

import {
  BacklogView,
  ProjectsView,
  DashboardsView,
  SearchIssuesView,
} from './shared/routes';

export default class App extends Component<{}> {
  render() {
    return (
      <HashRouter>
        <NavigationProvider>
          <ContainerViewSubscriber>
            {containerView => (
              <LayoutManager
                globalNavigation={DefaultGlobalNavigation}
                productRootNavigation={ProductRoot}
                productContainerNavigation={
                  containerView.state.activeView ? ProductContainer : null
                }
              >
                <div style={{ padding: 30 }}>
                  <Switch>
                    <Route path="/projects/endeavour" component={BacklogView} />
                    <Route path="/projects" component={ProjectsView} />
                    <Route path="/issues/search" component={SearchIssuesView} />
                    <Route path="/" component={DashboardsView} />
                  </Switch>
                </div>
              </LayoutManager>
            )}
          </ContainerViewSubscriber>
        </NavigationProvider>
      </HashRouter>
    );
  }
}
