import * as React from 'react';
import { Component } from 'react';
import { TimeRange } from '../src/newgen/viewers/video/TimeRange';

export interface ExampleState {
  currentTime: number;
}

class Example extends Component<any, ExampleState> {
  state: ExampleState = {
    currentTime: 20,
  };

  onChange = (currentTime: number) => {
    this.setState({ currentTime });
  };

  render() {
    const { currentTime } = this.state;

    return (
      <TimeRange
        currentTime={currentTime}
        duration={100}
        bufferedTime={30}
        onChange={this.onChange}
      />
    );
  }
}

export default Example;
