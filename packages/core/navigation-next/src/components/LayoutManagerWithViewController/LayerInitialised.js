// @flow

import React, { Component, Fragment } from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

import { navigationUILoaded } from '../../common/analytics';
import type { LayerInitialisedProps } from './types';

class LayerInitialised extends Component<LayerInitialisedProps> {
  componentDidMount() {
    if (!this.props.initialised) {
      this.fireInitialisedEvent();
    }
  }

  componentDidUpdate() {
    if (!this.props.initialised) {
      this.fireInitialisedEvent();
    }
  }

  fireInitialisedEvent = () => {
    const { createAnalyticsEvent, activeView, onInitialised } = this.props;
    if (activeView) {
      navigationUILoaded(createAnalyticsEvent, {
        layer: activeView.type,
      });
      if (onInitialised) {
        onInitialised();
      }
    }
  };

  render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}

export default withAnalyticsEvents()(LayerInitialised);
