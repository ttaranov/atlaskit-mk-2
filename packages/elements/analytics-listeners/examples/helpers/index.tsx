import * as React from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import Button from '@atlaskit/button';
import { FabricChannel } from '../../src';

export type Props = {
  text?: string;
  onClick: (e) => void;
};

export const DummyComponent: React.StatelessComponent<Props> = props => (
  <div id="dummy" onClick={props.onClick} style={{ paddingBottom: 12 }}>
    <Button appearance="help">{props.text ? props.text : 'Test'}</Button>
  </div>
);
DummyComponent.displayName = 'DummyComponent';

export const DummyComponentWithText = (
  channel: FabricChannel,
): React.StatelessComponent<Props> => props => (
  <DummyComponent text={channel} {...props} />
);

export const DummyComponentWithAnalytics = (channel: FabricChannel) =>
  withAnalyticsEvents({
    onClick: (createEvent, props) => {
      const event: GasPayload = {
        action: 'someAction',
        actionSubject: 'someComponent',
        eventType: 'ui',
        source: 'unknown',
      };
      createEvent(event).fire(channel);
    },
  })(DummyComponentWithText(channel));

export const DummyComponentWithAttributesWithAnalytics = (
  channel: FabricChannel,
) =>
  withAnalyticsEvents({
    onClick: (createEvent, props) => {
      const event: GasPayload = {
        action: 'someAction',
        actionSubject: 'someComponent',
        eventType: 'ui',
        source: 'unknown',
        attributes: {
          packageName: '@atlaskit/foo',
          packageVersion: '1.0.0',
          componentName: 'foo',
          fooBar: 'yay',
        },
      };
      createEvent(event).fire(channel);
    },
  })(DummyComponentWithText(channel));

export const TaggedDummyComponentWithAnalytics = (
  channel: FabricChannel,
  tag: string,
) =>
  withAnalyticsEvents({
    onClick: (createEvent, props) => {
      const event: GasPayload = {
        action: 'someAction',
        actionSubject: 'someComponent',
        eventType: 'ui',
        source: 'unknown',
        tags: [tag, 'foo'],
      };
      createEvent(event).fire(channel);
    },
  })(DummyComponent);

export const IncorrectEventType = (channel: FabricChannel) =>
  withAnalyticsEvents({
    onClick: (createEvent, props) => {
      // @ts-ignore
      const event: GasPayload = {
        action: 'someAction',
        actionSubject: 'someComponent',
        eventType: 'unknown',
        source: 'unknown',
      };
      createEvent(event).fire(channel);
    },
  })(DummyComponent);
