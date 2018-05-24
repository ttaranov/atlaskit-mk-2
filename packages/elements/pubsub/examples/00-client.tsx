import * as React from 'react';
import { Component } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import FieldText from '@atlaskit/field-text';

import Client from '../src';

let clientConfig;
try {
  // tslint:disable-next-line import/no-unresolved, no-var-requires
  clientConfig = require('../local-config')['default'];
} catch (e) {
  // tslint:disable-next-line import/no-unresolved, no-var-requires
  clientConfig = require('../local-config-example')['default'];
}

interface State {
  channelInput: string;
  eventType: string;
  events: string[];
}

class PubSubEventComponent extends Component<{}, State> {
  private client: Client;

  constructor(props) {
    super(props);
    this.client = new Client(clientConfig.serviceConfig);
    this.state = {
      channelInput: 'ari:cloud:platform::site/666',
      eventType: 'avi:emoji-service:updated:emoji',
      events: [],
    };
  }

  onJoin = () => {
    this.client.join([this.state.channelInput]);
  };

  onLeave = () => {
    this.client.leave([this.state.channelInput]);
  };

  onNetworkUp = () => {
    this.client.networkUp();
  };

  onNetworkDown = () => {
    this.client.networkDown();
  };

  onChannelChange = e => {
    this.setState({
      channelInput: e.target.value,
    });
  };

  onEventTypeChange = e => {
    this.setState({
      channelInput: e.target.value,
    });
  };

  onSubscribe = () => {
    this.client.on(this.state.eventType, this.onEvent);
  };

  onUnsubscribe = () => {
    this.client.off(this.state.eventType, this.onEvent);
  };

  onEvent = (event, payload) => {
    this.setState(({ events }) => {
      return {
        events: [...events, event],
      };
    });
  };

  render() {
    return (
      <div>
        <FieldText
          label="Channel"
          onChange={this.onChannelChange}
          value={this.state.channelInput}
          shouldFitContainer
        />
        <ButtonGroup>
          <Button onClick={this.onJoin}>Join</Button>
          <Button onClick={this.onLeave}>Leave</Button>
        </ButtonGroup>

        <FieldText
          label="Event type"
          onChange={this.onEventTypeChange}
          value={this.state.eventType}
          shouldFitContainer
        />
        <ButtonGroup>
          <Button onClick={this.onSubscribe}>Subscribe</Button>
          <Button onClick={this.onUnsubscribe}>Unsubscribe</Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button onClick={this.onNetworkUp}>Network Up</Button>
          <Button onClick={this.onNetworkDown}>Network Down</Button>
        </ButtonGroup>

        <div>
          {this.state.events.map((event, index) => {
            return <div key={index}>{event}</div>;
          })}
        </div>
      </div>
    );
  }
}

export default () => (
  <div>
    <h3>Events</h3>
    <PubSubEventComponent />
  </div>
);
