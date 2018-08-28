import * as React from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { GasPayload } from '../../../analytics-gas-types';

export type Props = {
  text?: string;
  onClick: (e) => void;
};

export const DummyComponent: React.StatelessComponent<Props> = props => (
  <div id="dummy" onClick={props.onClick} style={{ paddingBottom: 12 }}>
    <button>{props.text ? props.text : 'Test'}</button>
  </div>
);

export const createDummyComponentWithAnalytics = channel =>
  withAnalyticsEvents({
    onClick: (createEvent, props) => {
      const event: GasPayload = {
        action: 'someAction',
        actionSubject: 'someComponent',
        eventType: 'ui',
        source: 'unknown',
        attributes: {
          packageVersion: '1.0.0',
          packageName: '@atlaskit/foo',
          componentName: 'foo',
          foo: 'bar',
        },
      };
      createEvent(event).fire(channel);
    },
  })(DummyComponent);
