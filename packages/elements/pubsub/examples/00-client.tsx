import * as React from 'react';
import { Component } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import FieldText from '@atlaskit/field-text';
import Lozenge from '@atlaskit/lozenge';

import Client, { PubSubClientConfig, SpecialEventType } from '../src';

let clientConfig;
try {
  // tslint:disable-next-line import/no-unresolved, no-var-requires
  clientConfig = require('../local-config')['default'];
} catch (e) {
  // tslint:disable-next-line import/no-unresolved, no-var-requires
  clientConfig = require('../local-config-example')['default'];
}

interface State {
  url: string;
  channelInput: string;
  eventType: string;
  events: string[];
  status: string;
}

class PubSubEventComponent extends Component<{}, State> {
  private client: Client;
  private serviceConfig: PubSubClientConfig;

  constructor(props) {
    super(props);
    this.serviceConfig = clientConfig.serviceConfig;
    this.state = {
      url: clientConfig.serviceConfig.url,
      channelInput: 'ari:cloud:platform::site/666',
      eventType: 'avi:emoji-service:updated:emoji',
      events: [],
      status: 'NOT CONNECTED',
    };
    this.initClient(clientConfig.serviceConfig.url);
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

  onUrlChange = e => {
    const newUrl = e.target.value;
    this.setState({
      url: e.target.value,
    });

    this.client.leave([this.state.channelInput]).then(_ => {
      this.initClient(newUrl);
    });
  };

  onEventTypeChange = e => {
    this.setState({
      eventType: e.target.value,
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

  updateStatus = status => {
    this.setState({
      status,
    });
  };

  private initClient = url => {
    this.setState({
      status: 'NOT CONNECTED',
    });

    this.client = new Client({ ...this.serviceConfig, url });
    this.client.on(SpecialEventType.CONNECTED, () =>
      this.updateStatus('CONNECTED'),
    );
  };

  render() {
    return (
      <div>
        <h2>Config</h2>
        <FieldText
          id="serviceUrl"
          label="Service"
          onChange={this.onUrlChange}
          value={this.state.url}
          shouldFitContainer
        />

        <FieldText
          id="channel"
          label="Channel"
          onChange={this.onChannelChange}
          value={this.state.channelInput}
          shouldFitContainer
        />
        <ButtonGroup>
          <Button onClick={this.onJoin}>Join</Button>
          <Button onClick={this.onLeave}>Leave</Button>
          <Lozenge id="status" appearance="success">
            {this.state.status}
          </Lozenge>
        </ButtonGroup>

        <FieldText
          id="eventType"
          label="Event type"
          onChange={this.onEventTypeChange}
          value={this.state.eventType}
          shouldFitContainer
        />
        <ButtonGroup>
          <Button id="subscribe" onClick={this.onSubscribe}>
            Subscribe
          </Button>
          <Button id="unsubscribe" onClick={this.onUnsubscribe}>
            Unsubscribe
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button id="networkUp" onClick={this.onNetworkUp}>
            Network Up
          </Button>
          <Button id="networkDown" onClick={this.onNetworkDown}>
            Network Down
          </Button>
        </ButtonGroup>

        <h2>Events</h2>
        <div>Received {this.state.events.length} events.</div>
        <ol id="events">
          {this.state.events.map((event, index) => {
            return <li key={index}>{event}</li>;
          })}
        </ol>
      </div>
    );
  }
}

export default () => (
  <div>
    <PubSubEventComponent />
  </div>
);
