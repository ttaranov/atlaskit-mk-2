// @flow

import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { Label } from '@atlaskit/field-base';
import { ToggleStateless } from '@atlaskit/toggle';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';

import { LayoutManagerWithViewController, NavigationProvider } from '../src';

import { DefaultGlobalNavigation, ProjectSwitcher } from './shared/components';

import {
  BacklogView,
  ProjectsView,
  DashboardsView,
  SearchIssuesView,
} from './shared/routes';

const mockClient = {
  sendUIEvent: console.log,
  sendOperationalEvent: console.log,
  sendTrackEvent: console.log,
  sendScreenEvent: console.log,
};

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
      <FabricAnalyticsListeners client={Promise.resolve(mockClient)}>
        <HashRouter>
          <NavigationProvider
            initialPeekViewId="root/index"
            isDebugEnabled={isDebugEnabled}
          >
            <LayoutManagerWithViewController
              customComponents={{ ProjectSwitcher }}
              globalNavigation={DefaultGlobalNavigation}
            >
              <div style={{ padding: 30 }}>
                <Switch>
                  <Route path="/projects/:projectId" component={BacklogView} />
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
            </LayoutManagerWithViewController>
          </NavigationProvider>
        </HashRouter>
      </FabricAnalyticsListeners>
    );
  }
}
