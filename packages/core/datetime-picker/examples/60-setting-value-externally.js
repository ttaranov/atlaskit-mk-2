// @flow

import React, { Component } from 'react';
import { Label } from '@atlaskit/field-base';
import FieldText from '@atlaskit/field-text';
import { DatePicker, TimePicker, DateTimePicker } from '../src';

type State = {
  datePickerValue: string,
  timePickerValue: string,
  dateTimePickerValue: string,
};

export default class MyComponent extends Component<{}, State> {
  state = {
    datePickerValue: '2018-01-02',
    timePickerValue: '14:30',
    dateTimePickerValue: '2018-01-02T14:30+11:00',
  };

  onDatePickerChange = (e: any) => {
    this.setState({
      datePickerValue: e.target.value,
    });
  };

  onTimePickerChange = (e: any) => {
    this.setState({
      timePickerValue: e.target.value,
    });
  };

  onDateTimePickerChange = (e: any) => {
    this.setState({
      dateTimePickerValue: e.target.value,
    });
  };

  render() {
    const {
      datePickerValue,
      timePickerValue,
      dateTimePickerValue,
    } = this.state;
    return (
      <div>
        <p>
          This demonstrates updating each pickers value via an external source.
        </p>
        <h3>Date picker</h3>
        <FieldText
          label="Input"
          shouldFitContainer
          value={datePickerValue}
          onChange={this.onDatePickerChange}
        />

        <Label label="Date" />
        <DatePicker value={datePickerValue} isDisabled onChange={console.log} />

        <h3>Time picker</h3>
        <FieldText
          label="Input"
          shouldFitContainer
          value={timePickerValue}
          onChange={this.onTimePickerChange}
        />

        <Label label="Date" />
        <TimePicker value={timePickerValue} isDisabled onChange={console.log} />

        <h3>Date / time picker</h3>
        <FieldText
          label="Input"
          shouldFitContainer
          value={dateTimePickerValue}
          onChange={this.onDateTimePickerChange}
        />

        <Label label="Date" />
        <DateTimePicker
          value={dateTimePickerValue}
          isDisabled
          onChange={console.log}
        />
      </div>
    );
  }
}
