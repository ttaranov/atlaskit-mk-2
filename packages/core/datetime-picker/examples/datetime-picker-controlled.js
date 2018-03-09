// @flow

import React, { Component } from 'react';
import { Label } from '@atlaskit/field-base';
import { DateTimePicker } from '../src';

type State = {
  date: ?string,
  time: ?string,
};

class ControlledDateTimePicker extends Component<{}, State> {
  state = {
    date: '2017-12-01',
    time: '1:00pm',
  };

  handleChange = (date, time) => {
    console.log('onChange', date, time);
    this.setState({ date, time });
  };

  render() {
    return (
      <DateTimePicker
        value={[this.state.date, this.state.time]}
        onChange={this.handleChange}
      />
    );
  }
}

export default () => {
  return (
    <div>
      <Label label="Date picker with controlled value" />
      <ControlledDateTimePicker />
    </div>
  );
};
