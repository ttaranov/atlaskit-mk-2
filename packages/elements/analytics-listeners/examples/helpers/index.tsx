import * as React from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import Button from '@atlaskit/button';

import {
  ELEMENTS_CHANNEL,
  ELEMENTS_TAG,
} from '../../src/FabricElementsListener';

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

const DummyElementsComponent: React.StatelessComponent<Props> = props => (
  <DummyComponent {...props} />
);

const DummyAtlaskitComponent: React.StatelessComponent<Props> = props => (
  <DummyComponent text="Atlaskit (core) event" {...props} />
);

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
})(DummyElementsComponent);

export const DummyComponentWithAttributesWithAnalytics = withAnalyticsEvents({
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
    createEvent(event).fire(ELEMENTS_CHANNEL);
  },
})(DummyElementsComponent);

export const DummyAtlaskitComponentWithAnalytics = withAnalyticsEvents({
  onClick: (createEvent, props) => {
    const event: GasPayload = {
      action: 'someAction',
      actionSubject: 'someComponent',
      eventType: 'ui',
      source: 'unknown',
    };
    createEvent(event).fire('atlaskit');
  },
})(DummyAtlaskitComponent);

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

export const IncorrectEventType = withAnalyticsEvents({
  onClick: (createEvent, props) => {
    const event: GasPayload = {
      action: 'someAction',
      actionSubject: 'someComponent',
      // @ts-ignore
      eventType: 'unknown',
      source: 'unknown',
    };
    createEvent(event).fire('atlaskit');
  },
})(DummyComponent);
