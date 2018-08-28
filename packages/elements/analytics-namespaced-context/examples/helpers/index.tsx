import * as React from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { GasPayload } from '../../../analytics-gas-types';
import {
  WithAnalyticsEventProps,
  CreateUIAnalyticsEventSignature,
  UIAnalyticsEventInterface,
} from '@atlaskit/analytics-next-types';

export type Props = WithAnalyticsEventProps & {
  text?: string;
  onClick: (e) => void;
};

class DummyComponent extends React.Component<Props> {
  render() {
    const { onClick, text } = this.props;
    return (
      <div id="dummy" onClick={onClick} style={{ paddingBottom: 12 }}>
        <button>{text || 'Test'}</button>
      </div>
    );
  }
}

export const createDummyComponentWithAnalytics = channel =>
  withAnalyticsEvents<Props>({
    onClick: (
      createEvent: CreateUIAnalyticsEventSignature,
      props: Props,
    ): UIAnalyticsEventInterface => {
      const payload: GasPayload = {
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
      const event = createEvent(payload);
      event.fire(channel);
      return event;
    },
  })(DummyComponent);
