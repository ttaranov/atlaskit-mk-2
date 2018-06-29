import * as React from 'react';

import { GasPayload } from '@atlaskit/analytics-gas-types';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { DEFUALT_GAS_CHANNEL } from '../../util/analytics';
import { CreateAnalyticsEventFn } from './types';

export type PayloadProvider = () => GasPayload;

export interface Props {
  payloadProvider: PayloadProvider;
  onEventFired: Function;
  createAnalyticsEvent: CreateAnalyticsEventFn;
}

class AnalyticsEventFiredOnMount extends React.Component<Props> {
  componentDidMount() {
    if (this.props.createAnalyticsEvent) {
      const event = this.props.createAnalyticsEvent();
      event.update(this.props.payloadProvider()).fire(DEFUALT_GAS_CHANNEL);
      this.props.onEventFired();
    }
  }
  render() {
    return null;
  }
}

export const WrappedAnalyticsEventFiredOnMount = AnalyticsEventFiredOnMount;

export default withAnalyticsEvents()(AnalyticsEventFiredOnMount);
