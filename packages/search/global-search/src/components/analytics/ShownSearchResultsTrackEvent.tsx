import * as React from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { GasPayload } from '@atlaskit/analytics-gas-types';

import {
  DEFAULT_GAS_SOURCE,
  DEFUALT_GAS_CHANNEL,
  DEFAULT_GAS_ATTRIBUTES,
} from '../../util/analytics';

export interface Props {
  actionSubject: string;
  createAnalyticsEvent?: Function;
}

class ShownSearchResultsTrackEvent extends React.Component<Props> {
  componentDidMount() {
    if (this.props.createAnalyticsEvent) {
      const payload: GasPayload = {
        action: 'shown',
        actionSubject: this.props.actionSubject,
        eventType: 'ui',
        source: DEFAULT_GAS_SOURCE,
        attributes: {
          ...DEFAULT_GAS_ATTRIBUTES,
        },
      };
      this.props.createAnalyticsEvent(payload).fire(DEFUALT_GAS_CHANNEL);
    }
  }

  render() {
    return null;
  }
}

export default withAnalyticsEvents()(ShownSearchResultsTrackEvent);
