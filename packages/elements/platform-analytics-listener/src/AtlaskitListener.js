// @flow

import React, { Component, type Node } from 'react';
import {
  AnalyticsListener,
  type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import type { AnalyticsClient } from './types';

type Props = {
  analyticsClient: AnalyticsClient,
  children: Node,
};

export default class AtlaskitListener extends Component<Props> {
  onEvent = (analyticsEvent: UIAnalyticsEvent) => {
    const { payload, context } = analyticsEvent;
    // console.log(payload, context);

    const componentHierarchy = context
      .filter(({ component }) => typeof component === 'string')
      .map(({ component }) => component)
      .join('.');

    const {
      component: actionSubject,
      package: packageName,
      version: packageVersion,
    } = context[context.length - 1];

    const uiEvent = {
      action: payload.action,
      actionSubject,
      attributes: {
        packageName,
        packageVersion,
        componentHierarchy,
      },
    };
    this.props.analyticsClient.sendUIEvent(uiEvent);
  };

  render() {
    const { children } = this.props;
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.onEvent}>
        {children}
      </AnalyticsListener>
    );
  }
}
