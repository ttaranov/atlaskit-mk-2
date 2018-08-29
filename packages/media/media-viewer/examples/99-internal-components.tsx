import * as React from 'react';
import { Component } from 'react';
import { TimeRange } from '../src/newgen/viewers/video/TimeRange';
import { Container, Group, TimeRangeWrapper } from '../example-helpers/styled';

export interface ExampleState {
  currentTime1: number;
  currentTime2: number;
}

export default class Example extends Component<any, ExampleState> {
  state: ExampleState = {
    currentTime1: 20,
    currentTime2: 0,
  };

  onChange1 = (currentTime1: number) => {
    this.setState({ currentTime1 });
  };

  onChange2 = (currentTime2: number) => {
    this.setState({ currentTime2 });
  };

  render() {
    const { currentTime1, currentTime2 } = this.state;

    return (
      <Container>
        <Group>
          <h2>Time range</h2>
          {currentTime1}
          <TimeRangeWrapper>
            <TimeRange
              currentTime={currentTime1}
              duration={100}
              bufferedTime={30}
              onChange={this.onChange1}
            />
          </TimeRangeWrapper>
          {currentTime2}
          <TimeRangeWrapper>
            <TimeRange
              currentTime={currentTime2}
              duration={100}
              bufferedTime={0}
              onChange={this.onChange2}
            />
          </TimeRangeWrapper>
        </Group>
      </Container>
    );
  }
}
