import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { UIAnalyticsEventHandlerSignature } from '@atlaskit/analytics-next-types';
import {
  GasPayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types/index';
import { sendEvent } from '../analytics-web-client-wrapper';
import { ListenerProps, FabricChannel } from '../types';

export default class MediaAnalyticsListener extends React.Component<
  ListenerProps
> {
  listenerHandler: UIAnalyticsEventHandlerSignature = event => {
    const { client, logger } = this.props;
    logger.debug('Received Media event', event);

    if (event.payload) {
      sendEvent(logger, client)(event.payload as
        | GasPayload
        | GasScreenEventPayload);
    }
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.listenerHandler}
        channel={FabricChannel.media}
      >
        {this.props.children}
      </AnalyticsListener>
    );
  }
}
