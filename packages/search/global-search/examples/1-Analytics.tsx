import * as React from 'react';
import { GlobalQuickSearch } from '../src/index';
import { AtlaskitThemeProvider } from '@atlaskit/theme';
import BasicNavigation from '../example-helpers/BasicNavigation';
import { setupMocks, teardownMocks } from '../example-helpers/mockApis';
import { AnalyticsListener as AnalyticsNextListener } from '@atlaskit/analytics-next';
import styled from 'styled-components';

import { AnalyticsListener } from '@atlaskit/analytics';
import { GasPayload } from '@atlaskit/analytics-gas-types';

const Panel = styled.div`
  flex: 1;
  padding: 8px;
`;

const Bordered = styled.div`
  border: #ddd 1px solid;
  border-radius: 3px;
  margin-top: 8px;
`;

const Outer = styled.div`
  display: flex;
`;

const EventsList = styled.ul`
  li:first-child {
    color: green;
  }
`;

export default class extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
    };
  }

  componentWillMount() {
    setupMocks();
  }

  componentWillUnmount() {
    teardownMocks();
  }

  onEvent = (eventName: string, eventData: Object) => {
    const event = {
      name: eventName,
      data: eventData,
    };

    this.setState(prevState => ({
      events: [event, ...prevState.events],
    }));
  };

  onAnalyticsNextEvent(event) {
    this.onEvent(
      `${event.payload.actionSubject} ${event.payload.action}`,
      event.payload,
    );
  }

  render() {
    const events = this.state.events;

    return (
      <Outer>
        <Panel>
          <h2>Quick search - ignore styling/keyboard issues for now</h2>
          <Bordered>
            <AnalyticsListener onEvent={this.onEvent}>
              <AnalyticsListener onEvent={this.onEvent} matchPrivate={true}>
                <AnalyticsNextListener
                  channel="globalSearch"
                  onEvent={e => this.onAnalyticsNextEvent(e)}
                >
                  <AtlaskitThemeProvider mode="light">
                    <GlobalQuickSearch cloudId="cloudId" context="confluence" />
                  </AtlaskitThemeProvider>
                </AnalyticsNextListener>
              </AnalyticsListener>
            </AnalyticsListener>
          </Bordered>
        </Panel>

        <Panel>
          <h2>Analytics Events</h2>
          <Bordered>
            <EventsList>
              {events.map((event, i) => (
                <li key={i}>
                  <strong>Event:</strong> {event.name} | <strong>Data:</strong>{' '}
                  {JSON.stringify(event.data)}
                </li>
              ))}
            </EventsList>
          </Bordered>
        </Panel>
      </Outer>
    );
  }
}
