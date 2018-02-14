// @flow

import React, { Component } from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import Navigation, { AkNavigationItem } from '../src';

type State = {
  isOpen: boolean,
  openDrawer: string | null,
  width?: number,
};

type ResizeState = {
  isOpen: boolean,
  width: number,
};

// eslint-disable-next-line react/no-multi-comp
export default class BasicNavigation extends Component<{}, State> {
  state = {
    isOpen: true,
    openDrawer: null,
  };

  openDrawer = (name: string) => {
    this.setState({
      openDrawer: name,
    });
  };

  closeDrawer = () => {
    this.setState({
      openDrawer: null,
    });
  };

  resize = (resizeState: ResizeState) => {
    this.setState({
      isOpen: resizeState.isOpen,
      width: resizeState.width,
    });
  };

  render() {
    return (
      <AnalyticsListener
        channel="atlaskit"
        onEvent={analyticsEvent => {
          const { context, payload } = analyticsEvent;
          console.log(payload, context);
        }}
      >
        <div
          style={{
            height: '100%',
            left: '0',
            position: 'fixed',
            top: '0',
            width: '100%',
            zIndex: '10',
          }}
        >
          <Navigation
            isOpen={this.state.isOpen}
            onResize={this.resize}
            width={this.state.width || undefined}
          >
            <AkNavigationItem text="Click me" />
          </Navigation>
        </div>
      </AnalyticsListener>
    );
  }
}
