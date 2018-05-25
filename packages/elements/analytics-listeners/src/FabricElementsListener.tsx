import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { GasPayload } from '@atlaskit/analytics-gas-types';
import { sendEvent } from './analytics-web-client-wrapper';
import { AnalyticsWebClient } from './types';

export const ELEMENTS_CHANNEL = 'fabric-elements';
export const ELEMENTS_TAG = 'fabricElements';

export type EventNextType = {
  payload: GasPayload;
  context?: any;
};

export type ListenerFunction = (event: EventNextType) => void;

export type Props = {
  /** Children! */
  children?: React.ReactNode;
  client: AnalyticsWebClient;
};

export default class FabricElementsListener extends React.Component<Props> {
  listenerHandler: ListenerFunction = event => {
    if (event.payload) {
      const tags: Set<string> = new Set(event.payload.tags || []);
      tags.add(ELEMENTS_TAG);
      event.payload.tags = Array.from(tags);
    }
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
