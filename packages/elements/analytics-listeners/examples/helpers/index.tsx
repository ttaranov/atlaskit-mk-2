import * as React from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import Button from '@atlaskit/button';
import { FabricChannel } from '../../src';
import {
  WithAnalyticsEventProps,
  CreateUIAnalyticsEventSignature,
} from '@atlaskit/analytics-next-types';

export type OwnProps = {
  onClick: (e) => void;
};

export type Props = WithAnalyticsEventProps & OwnProps;

const CustomButton = ({ onClick, text }) => (
  <div id="dummy" onClick={onClick} style={{ paddingBottom: 12 }}>
    <Button appearance="help">{text || 'Test'}</Button>
  </div>
);

export class DummyElementsComponent extends React.Component<Props> {
  static displayName = 'DummyElementsComponent';

  render() {
    return (
      <CustomButton
        text={FabricChannel.elements}
        onClick={this.props.onClick}
      />
    );
  }
}

export class DummyAtlaskitComponent extends React.Component<OwnProps> {
  static displayName = 'DummyAtlaskitComponent';
  render() {
    return (
      <CustomButton
        text={FabricChannel.atlaskit}
        onClick={this.props.onClick}
      />
    );
  }
}

export class DummyNavigationComponent extends React.Component<OwnProps> {
  static displayName = 'DummyNavigationComponent';
  render() {
    return (
      <CustomButton
        text={FabricChannel.navigation}
        onClick={this.props.onClick}
      />
    );
  }
}

export class DummyEditorComponent extends React.Component<OwnProps> {
  static displayName = 'DummyEditorComponent';
  render() {
    return (
      <CustomButton text={FabricChannel.editor} onClick={this.props.onClick} />
    );
  }
}

const componentChannels = {
  [FabricChannel.atlaskit]: DummyAtlaskitComponent,
  [FabricChannel.elements]: DummyElementsComponent,
  [FabricChannel.navigation]: DummyNavigationComponent,
  [FabricChannel.editor]: DummyEditorComponent,
};

export const createComponentWithAnalytics = (channel: FabricChannel) =>
  withAnalyticsEvents<Props>({
    onClick: (createEvent: CreateUIAnalyticsEventSignature, props: Props) => {
      const payload: GasPayload = {
        action: 'someAction',
        actionSubject: 'someComponent',
        eventType: 'ui',
        source: 'unknown',
      };
      const event = createEvent(payload);
      event.fire(channel);
      return event;
    },
  })(componentChannels[channel] as any) as React.ComponentClass<OwnProps>;

export const createComponentWithAttributesWithAnalytics = (
  channel: FabricChannel,
) =>
  withAnalyticsEvents<Props>({
    onClick: (createEvent: CreateUIAnalyticsEventSignature, props: Props) => {
      const payload: GasPayload = {
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
      const event = createEvent(payload);
      event.fire(channel);
      return event;
    },
  })(componentChannels[channel] as any) as React.ComponentClass<OwnProps>;

export const createTaggedComponentWithAnalytics = (
  channel: FabricChannel,
  tag: string,
) =>
  withAnalyticsEvents<Props>({
    onClick: (createEvent: CreateUIAnalyticsEventSignature, props: Props) => {
      const payload: GasPayload = {
        action: 'someAction',
        actionSubject: 'someComponent',
        eventType: 'ui',
        source: 'unknown',
        tags: [tag, 'foo'],
      };
      const event = createEvent(payload);
      event.fire(channel);
      return event;
    },
  })(componentChannels[channel] as any) as React.ComponentClass<OwnProps>;

export const IncorrectEventType = (channel: FabricChannel) =>
  withAnalyticsEvents<Props>({
    onClick: (createEvent: CreateUIAnalyticsEventSignature, props: Props) => {
      // @ts-ignore
      const payload: GasPayload = {
        action: 'someAction',
        actionSubject: 'someComponent',
        eventType: 'unknown',
        source: 'unknown',
      };
      const event = createEvent(payload);
      event.fire(channel);
      return event;
    },
  })(componentChannels[channel] as any) as React.ComponentClass<OwnProps>;

class MyButton extends React.Component<Props> {
  static displayName = 'MyButton';
  render() {
    return (
      <button id="dummy" onClick={this.props.onClick}>
        Test [click on me]
      </button>
    );
  }
}

export const createButtonWithAnalytics = (payload, channel: FabricChannel) =>
  withAnalyticsEvents<Props>({
    onClick: (createEvent: CreateUIAnalyticsEventSignature, props: Props) => {
      const event = createEvent(payload);
      event.fire(channel);
      return event;
    },
  })(MyButton);
