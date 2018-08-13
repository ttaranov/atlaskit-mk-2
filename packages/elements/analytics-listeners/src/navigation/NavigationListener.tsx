import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { sendEvent } from '../analytics-web-client-wrapper';
import { ListenerProps, ListenerFunction, FabricChannel } from '../types';

import processEvent from './process-event';

export default class NavigationListener extends React.Component<ListenerProps> {
  listenerHandler: ListenerFunction = event => {
    const { client, logger } = this.props;
    logger.debug('Received Navigation event', event);
    const payload = processEvent(event, logger);
    logger.debug('Processed Navigation event', payload);

    if (payload) {
      sendEvent(client, logger)(payload);
    }
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.listenerHandler}
        channel={FabricChannel.navigation}
      >
        {this.props.children}
      </AnalyticsListener>
    );
  }
}
