// @flow

import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { Label } from '@atlaskit/field-base';
import { ToggleStateless } from '@atlaskit/toggle';

import { LayoutManagerWithViewController, NavigationProvider } from '../src';

import { DefaultGlobalNavigation, ProjectSwitcher } from './shared/components';

import {
  BacklogView,
  ProjectsView,
  DashboardsView,
  SearchIssuesView,
} from './shared/routes';

type RightPageContainerProps = {
  isFlyoutAvailable: boolean,
  isDebugEnabled: boolean,
  onDebugToggle: (SyntheticEvent<any>) => void,
  onFlyoutToggle: (SyntheticEvent<any>) => void,
};
class RightPageContainer extends Component<RightPageContainerProps> {
  componentDidMount() {
    console.log('RightPageContainer component mounted');
    // debugger; //eslint-disable-line
  }

  render() {
    const {
      isFlyoutAvailable,
      onFlyoutToggle,
      isDebugEnabled,
      onDebugToggle,
    } = this.props;
    return (
      <div style={{ padding: 40 }}>
        <Switch>
          <Route path="/projects/:projectId" component={BacklogView} />
          <Route path="/projects" component={ProjectsView} />
          <Route path="/issues/search" component={SearchIssuesView} />
          <Route path="/" component={DashboardsView} />
        </Switch>

        <p>
          The search drawer can be opened via the <kbd>/</kbd> keyboard
          shortcut.
        </p>
        <Label label="Toggle flyout on hover (experimental)" />
        <ToggleStateless
          isChecked={isFlyoutAvailable}
          onChange={onFlyoutToggle}
        />
        <Label label="Toggle debug logger" />
        <ToggleStateless isChecked={isDebugEnabled} onChange={onDebugToggle} />
      </div>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
export default class App extends Component<
  {},
  {
    isDebugEnabled: boolean,
    isFlyoutAvailable: boolean,
  },
> {
  state = {
    isDebugEnabled: true,
    isFlyoutAvailable: true,
  };

  onDebugToggle = () => {
    this.setState(state => ({ isDebugEnabled: !state.isDebugEnabled }));
  };
  onFlyoutToggle = () => {
    this.setState(state => ({ isFlyoutAvailable: !state.isFlyoutAvailable }));
  };

  render() {
    const { isDebugEnabled, isFlyoutAvailable } = this.state;

    return (
      <HashRouter>
        <NavigationProvider
          initialPeekViewId="root/index"
          isDebugEnabled={isDebugEnabled}
        >
          <LayoutManagerWithViewController
            customComponents={{ ProjectSwitcher }}
            experimental_flyoutOnHover={isFlyoutAvailable}
            globalNavigation={DefaultGlobalNavigation}
          >
            <RightPageContainer
              isFlyoutAvailable={isFlyoutAvailable}
              onFlyoutToggle={this.onFlyoutToggle}
              isDebugEnabled={isDebugEnabled}
              onDebugToggle={this.onDebugToggle}
            />
          </LayoutManagerWithViewController>
        </NavigationProvider>
      </HashRouter>
    );
  }
}
