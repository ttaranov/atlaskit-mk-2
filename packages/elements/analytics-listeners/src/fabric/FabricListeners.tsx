import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { ELEMENTS_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import { sendEvent } from '../analytics-web-client-wrapper';
import { ListenerProps } from '../types';
import * as merge from 'lodash.merge';

export const ELEMENTS_CHANNEL = 'fabric-elements';
export const ELEMENTS_TAG = 'fabricElements';

export const EDITOR_CHANNEL = 'fabric-editor';
export const EDITOR_TAG = 'fabricEditor';

export type ListenerFunction = (
  event: { payload: GasPayload; context: Array<{}> },
) => void;

// merge all context objects from left to right. In case of attribute conflict the right one takes precedence
const processContext = (contexts: Array<{}>) =>
  contexts
    .filter(ctx => !!ctx[ELEMENTS_CONTEXT])
    .map(ctx => ctx[ELEMENTS_CONTEXT])
    .reduce((result, item) => merge(result || {}, item), {});

const updatePayloadWithContext = (event: {
  payload: GasPayload;
  context: Array<{}>;
}) => {
  if (event.context.length === 0) {
    return event.payload;
  }
  const mergedContext: any = processContext(event.context);
  event.payload.attributes = merge(
    mergedContext,
    event.payload.attributes || {},
  );
  return event.payload;
};

export default class FabricElementsListener extends React.Component<
  ListenerProps
> {
  static analyticsHandler(client, logger, event, tag) {
    const payload = updatePayloadWithContext(event);

    const tags: Set<string> = new Set(payload.tags || []);
    tags.add(tag);
    payload.tags = Array.from(tags);

    sendEvent(client, logger)(payload);
  }

  fabricElementsListenerHandler: ListenerFunction = event => {
    const { client, logger } = this.props;
    return FabricElementsListener.analyticsHandler(
      client,
      logger,
      event,
      ELEMENTS_TAG,
    );
  };

  fabricEditorListenerHandler: ListenerFunction = event => {
    const { client, logger } = this.props;
    return FabricElementsListener.analyticsHandler(
      client,
      logger,
      event,
      EDITOR_TAG,
    );
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.fabricElementsListenerHandler}
        channel={ELEMENTS_CHANNEL}
      >
        <AnalyticsListener
          onEvent={this.fabricEditorListenerHandler}
          channel={EDITOR_CHANNEL}
        >
          {this.props.children}
        </AnalyticsListener>
      </AnalyticsListener>
    );
  }
}
