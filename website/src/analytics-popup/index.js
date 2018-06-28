// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { math, gridSize } from '@atlaskit/theme';
import Popup from './popup';
import AnalyticsEventList from './analytics-event-list';
import AnalyticsEventCount from './analytics-event-count';

const Padding = styled.div`
  padding: ${math.multiply(gridSize, 2)}px 0;
`;

type Props = {
  onEvent: Function => void,
};

type State = {
  events: Object[],
  count: number,
};

const uniq = prefix => {
  let inc = 0;
  return () => `${prefix}-${++inc}`;
};

export default class AnalyticsPopup extends React.Component<Props> {
  id = uniq('event');
  state = {
    events: [],
    count: 0,
  };
  componentDidMount() {
    if (this.props.onEvent) {
      this.props.onEvent(this.onEvent);
    }
    this.listener = document.body.addEventListener('keypress', e => {
      if (e.ctrlKey && e.key === 'd') {
        this.setState({ events: [], count: 0 });
      }
    });
  }
  componentWillUnmount() {
    document.body.removeEventListener(this.listener);
  }
  onEvent = (event: Object) => {
    const events = [{ id: this.id(), event }].concat(this.state.events);
    if (events.length > 50) {
      events.pop();
    }
    this.setState({ events, count: this.state.count + 1 });
  };
  render() {
    const { children } = this.props;
    const { events, count } = this.state;
    return (
      <Popup
        header={<h3>Analytics Events</h3>}
        footer={
          <React.Fragment>
            <p>try ctrl+d to clear events</p>
            <Button onClick={() => this.setState({ events: [], count: 0 })}>
              Clear
            </Button>
          </React.Fragment>
        }
      >
        <p>
          This popup shows all events fired on the "atlaskit" channel. Find a
          bug? Call out in the <b>AK Analytics Blitz</b> Stride room.
        </p>
        <Padding>
          <AnalyticsEventList events={events} />
        </Padding>
        <AnalyticsEventCount count={count} />
      </Popup>
    );
  }
}
