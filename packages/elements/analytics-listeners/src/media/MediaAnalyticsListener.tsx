import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { UIAnalyticsEventHandlerSignature } from '@atlaskit/analytics-next-types';
import { DEFAULT_SOURCE, GasPayload } from '@atlaskit/analytics-gas-types';
import { sendEvent } from '../analytics-web-client-wrapper';
import { ListenerProps, FabricChannel } from '../types';

export default class MediaAnalyticsListener extends React.Component<
  ListenerProps
> {
  listenerHandler: UIAnalyticsEventHandlerSignature = event => {
    const { client, logger } = this.props;
    logger.debug('Received Media event', event);

    if (event.payload) {
      const payload = {
        source: DEFAULT_SOURCE,
        ...event.payload,
      } as GasPayload;
      sendEvent(logger, client)(payload);
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
