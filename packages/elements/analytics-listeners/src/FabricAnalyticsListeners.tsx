import * as React from 'react';

import { AnalyticsWebClient, FabricChannels } from './types';
import FabricElementsListener, {
  ELEMENTS_CHANNEL,
} from './FabricElementsListener';
import AtlaskitListener, {
  ATLASKIT_CHANNEL,
} from './atlaskit/AtlaskitListener';
import Logger from './helpers/logger';

export type Props = {
  /** Children! */
  children?: React.ReactNode;
  client: Promise<AnalyticsWebClient>;
  logLevel?: number;
  /** A list of individual listeners to exclude, identified by channel */
  excludedChannels?: FabricChannels[];
};

const listenerMap = {
  [ELEMENTS_CHANNEL]: FabricElementsListener,
  [ATLASKIT_CHANNEL]: AtlaskitListener,
};

class FabricAnalyticsListeners extends React.Component<Props> {
  logger: Logger;

  constructor(props) {
    super(props);

    this.logger = new Logger({ logLevel: props.logLevel });

    if (!props.client) {
      throw new Error('Analytics client not provided');
    }
  }

  render() {
    const { client, children, logLevel, excludedChannels } = this.props;
    if (typeof logLevel === 'number') {
      this.logger.setLogLevel(logLevel);
    }

    const listeners = Object.keys(listenerMap)
      .filter(
        (channel: FabricChannels) =>
          !excludedChannels || excludedChannels.indexOf(channel) < 0,
      )
      .map(channel => listenerMap[channel])
      .reduce(
        (prev, Listener) => (
          <Listener client={client} logger={this.logger}>
            {prev}
          </Listener>
        ),
        children,
      );

    return listeners;
  }
}

export default FabricAnalyticsListeners;
