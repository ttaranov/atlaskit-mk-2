// @flow

import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { Label } from '@atlaskit/field-base';
import { ToggleStateless } from '@atlaskit/toggle';

import { ViewStateSubscriber, LayoutManager, NavigationProvider } from '../src';

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

export default class App extends Component<{}, { isDebugEnabled: boolean }> {
  state = {
    isDebugEnabled: true,
  };

  onDebugToggle = () => {
    this.setState({ isDebugEnabled: !this.state.isDebugEnabled });
  };

  render() {
    const { isDebugEnabled } = this.state;

    return (
      <HashRouter>
        <NavigationProvider debug={isDebugEnabled}>
          <ViewStateSubscriber>
            {containerView => (
              <LayoutManager
                globalNavigation={DefaultGlobalNavigation}
                productRootNavigation={ProductRoot}
                productContainerNavigation={
                  containerView.state.containerViewId ? ProductContainer : null
                }
              >
                <div style={{ padding: 30 }}>
                  <Switch>
                    <Route
                      path="/projects/:projectId"
                      component={BacklogView}
                    />
                    <Route path="/projects" component={ProjectsView} />
                    <Route path="/issues/search" component={SearchIssuesView} />
                    <Route path="/" component={DashboardsView} />
                  </Switch>
                  <Label label="Toggle debug logger" />
                  <ToggleStateless
                    isChecked={isDebugEnabled}
                    onChange={this.onDebugToggle}
                  />
                </div>
              </LayoutManager>
            )}
          </ViewStateSubscriber>
        </NavigationProvider>
      </HashRouter>
    );
  }
}
