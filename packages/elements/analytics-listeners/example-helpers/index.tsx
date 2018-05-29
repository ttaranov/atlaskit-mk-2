import * as React from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

import { GasPayload } from '@atlaskit/analytics-gas-types';
import { ELEMENTS_CHANNEL, ELEMENTS_TAG } from '../src/FabricElementsListener';

export type Props = {
  onClick: (e) => void;
};

export const DummyComponent: React.StatelessComponent<Props> = props => (
  <div id="dummy" onClick={props.onClick}>
    Test [click on me]
  </div>
);
DummyComponent.displayName = 'DummyComponent';

export const DummyComponentWithAnalytics = withAnalyticsEvents({
  onClick: (createEvent, props) => {
    const event: GasPayload = {
      action: 'someAction',
      actionSubject: 'someComponent',
      eventType: 'ui',
      source: 'unknown',
    };
    createEvent(event).fire(ELEMENTS_CHANNEL);
  },
})(DummyComponent);

export const TaggedDummyComponentWithAnalytics = withAnalyticsEvents({
  onClick: (createEvent, props) => {
    const event: GasPayload = {
      action: 'someAction',
      actionSubject: 'someComponent',
      eventType: 'ui',
      source: 'unknown',
      tags: [ELEMENTS_TAG, 'foo'],
    };
    createEvent(event).fire(ELEMENTS_CHANNEL);
  },
})(DummyComponent);
