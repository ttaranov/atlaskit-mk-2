// @flow

import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { Label } from '@atlaskit/field-base';
import { ToggleStateless } from '@atlaskit/toggle';

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
                  <Label label="Toggle debug logger" />
                  <ToggleStateless
                    isChecked={isDebugEnabled}
                    onChange={this.onDebugToggle}
                  />
                </div>
              </LayoutManager>
            )}
          </ContainerViewSubscriber>
        </NavigationProvider>
      </HashRouter>
    );
  }
}
