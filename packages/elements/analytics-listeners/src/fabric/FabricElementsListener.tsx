import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import { sendEvent } from '../analytics-web-client-wrapper';
import { ListenerProps, FabricChannel } from '../types';

import { processEventPayload } from './process-event-payload';

export const ELEMENTS_TAG = 'fabricElements';
export const EDITOR_TAG = 'fabricEditor';

export type ListenerFunction = (
  event: { payload: GasPayload; context: Array<{}> },
) => void;

export default class FabricElementsListener extends React.Component<
  ListenerProps
> {
  sendEvent(payload) {
    const { client, logger } = this.props;
    return sendEvent(client, logger)(payload);
  }

  handleEvent(event, tag) {
    if (event.payload) {
      return;
    }

    const payload = processEventPayload(event, tag);
    this.sendEvent(payload);
  }

  elementsListenerHandler: ListenerFunction = event => {
    this.handleEvent(event, ELEMENTS_TAG);
  };

  editorListenerHandler: ListenerFunction = event => {
    this.handleEvent(event, EDITOR_TAG);
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.elementsListenerHandler}
        channel={FabricChannel.elements}
      >
        <AnalyticsListener
          onEvent={this.editorListenerHandler}
          channel={FabricChannel.editor}
        >
          {this.props.children}
        </AnalyticsListener>
      </AnalyticsListener>
    );
  }
}
