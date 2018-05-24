import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { sendEvent } from '../analytics-web-client-wrapper';
import { ListenerProps, ListenerFunction } from '../types';

import processEvent from './process-event';

const ATLASKIT_CHANNEL = 'atlaskit';

export default class AtlaskitListener extends React.Component<ListenerProps> {
  listenerHandler: ListenerFunction = event => {
    const payload = processEvent(event);

    if (payload) {
      sendEvent(this.props.client)(payload);
    }
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.listenerHandler}
        channel={ATLASKIT_CHANNEL}
      >
        {React.Children.only(this.props.children)}
      </AnalyticsListener>
    );
  }
}
