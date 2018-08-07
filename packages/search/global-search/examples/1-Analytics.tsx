import * as React from 'react';
import { GlobalQuickSearch } from '../src/index';
import BasicNavigation from '../example-helpers/BasicNavigation';
import { setupMocks, teardownMocks } from '../example-helpers/mockApis';
import { AnalyticsListener as AnalyticsNextListener } from '@atlaskit/analytics-next';
import styled from 'styled-components';
import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';

import { AnalyticsListener } from '@atlaskit/analytics';

const ComponentPanel = styled.div`
  flex: 1;
  display: flex;
`;

const EventsPanel = styled.div`
  flex: 1;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  z-index: 501;
  width: 300px;
  background: white;
  word-wrap: break-word;
  padding-right: 4px;
  min-height: 800px;
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
      <Outer id="outer">
        <ComponentPanel>
          <h2>Quick search - ignore styling/keyboard issues for now</h2>
          <AnalyticsListener onEvent={this.onEvent}>
            <AnalyticsListener onEvent={this.onEvent} matchPrivate={true}>
              <AnalyticsNextListener
                channel="fabric-elements"
                onEvent={e => this.onAnalyticsNextEvent(e)}
              >
                <BasicNavigation
                  searchDrawerContent={
                    <LocaleIntlProvider>
                      <GlobalQuickSearch
                        cloudId="cloudId"
                        context="confluence"
                        referralContextIdentifiers={{
                          currentContentId: '123',
                          searchReferrerId: 'abc',
                        }}
                      />
                    </LocaleIntlProvider>
                  }
                />
              </AnalyticsNextListener>
            </AnalyticsListener>
          </AnalyticsListener>
        </ComponentPanel>

        <EventsPanel>
          <h2>Analytics Events</h2>
          <a
            href="#"
            onClick={() => {
              this.setState({
                events: [],
              });
            }}
          >
            clear
          </a>
          <Bordered>
            <EventsList>
              {events.map((event, i) => (
                <li key={i}>
                  <strong>Event:</strong> {event.name} | <strong>Data:</strong>{' '}
                  <a
                    href="#"
                    onClick={() => {
                      if (this.state.expandedEvent === i) {
                        this.setState({ expandedEvent: null });
                      } else {
                        this.setState({ expandedEvent: i });
                      }
                    }}
                  >
                    Data
                  </a>
                  {i === this.state.expandedEvent ? (
                    <div>{JSON.stringify(event.data)}</div>
                  ) : null}
                </li>
              ))}
            </EventsList>
          </Bordered>
        </EventsPanel>
      </Outer>
    );
  }
}
