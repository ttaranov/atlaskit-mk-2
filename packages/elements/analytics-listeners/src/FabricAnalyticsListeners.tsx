import * as React from 'react';

import { AnalyticsWebClient } from './types';
import FabricListeners from './fabric/FabricListeners';
import AtlaskitListener from './atlaskit/AtlaskitListener';
import Logger from './helpers/logger';

export type Props = {
  /** Children! */
  children?: React.ReactNode;
  client: Promise<AnalyticsWebClient>;
  logLevel?: number;
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
    const { client, children, logLevel } = this.props;
    if (typeof logLevel === 'number') {
      this.logger.setLogLevel(logLevel);
    }
    return (
      <AtlaskitListener client={client} logger={this.logger}>
        <FabricListeners client={client} logger={this.logger}>
          {children}
        </FabricListeners>
      </AtlaskitListener>
    );
  }
}

export default FabricAnalyticsListeners;
