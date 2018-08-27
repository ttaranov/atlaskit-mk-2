import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { sendEvent } from '../analytics-web-client-wrapper';
import { ListenerProps, ListenerFunction, FabricChannel } from '../types';

import processEvent from './process-event';

export default class AtlaskitListener extends React.Component<ListenerProps> {
  listenerHandler: ListenerFunction = event => {
    const { client, logger } = this.props;
    logger.debug('Received Atlaskit event', event);
    const payload = processEvent(event, logger);
    logger.debug('Processed Atlaskit event', payload);

    if (payload) {
      sendEvent(client, logger)(payload);
    }
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.listenerHandler}
        channel={FabricChannel.atlaskit}
      >
        {this.props.children}
      </AnalyticsListener>
    );
  }
}
