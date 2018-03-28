// @flow

import React, { Component } from 'react';
import Button from '@atlaskit/button';
import { Label } from '@atlaskit/field-base';
import Lorem from 'react-lorem-component';
import Modal from '@atlaskit/modal-dialog';
import { DateTimePicker } from '../src';

type State = {
  datePickerValue: string,
  timePickerValue: string,
  dateTimePickerValue: string,
  isModalOpen: boolean,
};

export default class MyComponent extends Component<{}, State> {
  state = {
    datePickerValue: '2018-01-02',
    timePickerValue: '14:30',
    dateTimePickerValue: '2018-01-02T14:30+11:00',
    isModalOpen: false,
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

  openModal = () => {
    this.setState({
      isModalOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  render() {
    const { dateTimePickerValue, isModalOpen } = this.state;
    return (
      <div>
        <p>This demonstrates displaying a date time picker within a modal</p>

        <Button onClick={this.openModal}>Open modal</Button>

        {isModalOpen && (
          <Modal onClose={this.closeModal}>
            <Lorem count="5" />
            <Label label="Date" />
            <DateTimePicker defaultValue={dateTimePickerValue} />
            <Lorem count="5" />
          </Modal>
        )}
        <div style={{ height: 500 }} />
        <DateTimePicker defaultValue={dateTimePickerValue} />
      </div>
    );
  }
}
