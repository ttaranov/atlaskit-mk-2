import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { GasPayload } from '@atlaskit/analytics-gas-types';
import { sendEvent } from './analytics-web-client-wrapper';
import { ListenerProps } from './types';

const ELEMENTS_CHANNEL = 'fabric-elements';

export type ListenerFunction = (
  event: { payload: GasPayload; context: Array<{}> },
) => void;

export default class FabricElementsListener extends React.Component<
  ListenerProps
> {
  listenerHandler: ListenerFunction = event => {
    sendEvent(this.props.client)(event.payload);
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.listenerHandler}
        channel={ELEMENTS_CHANNEL}
      >
        {React.Children.only(this.props.children)}
      </AnalyticsListener>
    );
  }
}
