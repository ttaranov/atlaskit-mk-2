// @flow

import React, { Component, type Node } from 'react';

import AtlaskitListener from './AtlaskitListener';
import type { AnalyticsClient } from './types';

type Props = {
  analyticsClient: AnalyticsClient,
  children: Node,
};

export default class PlatformAnalyticsListener extends Component<Props> {
  render() {
    const { analyticsClient, children } = this.props;
    return (
      <AtlaskitListener analyticsClient={analyticsClient}>
        {children}
      </AtlaskitListener>
    );
  }
}
