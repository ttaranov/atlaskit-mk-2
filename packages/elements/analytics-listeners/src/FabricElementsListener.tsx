import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { GasPayload } from '@atlaskit/analytics-gas-types';
import { mapEventTypeToDispatcher } from './utils';
import { AnalyticsWebClient } from './types';
import debug from './logger';

const ELEMENTS_CHANNEL = 'fabric-elements';

export type EventNextType = {
  payload: GasPayload;
  context?: object;
};

export type ListenerFunction = (event: EventNextType) => void;

export type Props = {
  /** Children! */
  children?: React.ReactNode;
  client: AnalyticsWebClient;
};

export default class FabricElementsListener extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  listenerHandler: ListenerFunction = (event: EventNextType) => {
    const gasEvent = {
      ...event.payload,
    };

    const eventType = gasEvent.eventType;
    delete gasEvent!.eventType;

    const dispatchers: object = mapEventTypeToDispatcher(this.props.client);
    const dispatcher = dispatchers[eventType];
    if (dispatcher) {
      dispatcher(gasEvent);
    } else {
      debug(
        `cannot map eventType ${eventType} to an analytics-web-client function`,
      );
    }
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
