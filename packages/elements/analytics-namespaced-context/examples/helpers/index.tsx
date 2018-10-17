import * as React from 'react';
import {
  withAnalyticsEvents,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { WithAnalyticsEventProps } from '@atlaskit/analytics-next-types';

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
  withAnalyticsEvents({
    onClick: createAndFireEvent(channel)({
      action: 'someAction',
      actionSubject: 'someComponent',
      eventType: 'ui',
      attributes: {
        packageVersion: '1.0.0',
        packageName: '@atlaskit/foo',
        componentName: 'foo',
        foo: 'bar',
      },
    }),
  })(DummyComponent);
