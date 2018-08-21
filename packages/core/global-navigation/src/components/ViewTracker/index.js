// @flow

import { Component } from 'react';
import {
  withAnalyticsEvents,
  type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

import { NAVIGATION_CHANNEL } from '../../constants';

type Props = {
  name: string,
} & WithAnalyticsEventsProps;

class ViewTracker extends Component<Props> {
  componentDidMount() {
    const { name, createAnalyticsEvent } = this.props;
    createAnalyticsEvent({
      eventType: 'screen',
      name,
    }).fire(NAVIGATION_CHANNEL);
  }

  render() {
    return null;
  }
}

export default withAnalyticsEvents()(ViewTracker);
