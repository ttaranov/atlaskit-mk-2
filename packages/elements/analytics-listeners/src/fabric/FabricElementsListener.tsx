import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { ListenerProps, FabricChannel } from '../types';

import { handleEvent } from './handle-event';
import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next-types';

export const ELEMENTS_TAG = 'fabricElements';

export default class FabricElementsListener extends React.Component<
  ListenerProps
> {
  handleEventWrapper = (event: UIAnalyticsEventInterface) => {
    handleEvent(event, ELEMENTS_TAG, this.props.logger, this.props.client);
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.handleEventWrapper}
        channel={FabricChannel.elements}
      >
        {this.props.children}
      </AnalyticsListener>
    );
  }
}
