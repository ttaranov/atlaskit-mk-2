import * as React from 'react';
import { Component } from 'react';
import { TimeRange } from '../src/newgen/viewers/video/TimeRange';

class Example extends Component<any, any> {
  onChange = () => {};

  render() {
    return (
      <TimeRange
        currentTime={20}
        duration={100}
        bufferedTime={30}
        onChange={this.onChange}
      />
    );
  }
}

export default Example;
