import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { GasPayload } from '@atlaskit/analytics-gas-types';
import { sendEvent } from '../analytics-web-client-wrapper';
import { AnalyticsWebClient } from '../types';

import processEvent from './process-event';

const ATLASKIT_CHANNEL = 'atlaskit';

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

export default class AtlaskitListener extends React.Component<Props> {
  listenerHandler: ListenerFunction = event => {
    const payload = processEvent(event);

    // @ts-ignore
    sendEvent(this.props.client)(payload);
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.listenerHandler}
        channel={ATLASKIT_CHANNEL}
      >
        {React.Children.only(this.props.children)}
      </AnalyticsListener>
    );
  }
}
