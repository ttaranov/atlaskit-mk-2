// @flow

import React, { Component } from 'react';
// import type { EventChange, EventSelect } from '@atlaskit/calendar';
// import { parse, format, isValid, getDate, getMonth, getYear } from 'date-fns';
import BasePicker from './internal/Picker';
import DateField from './internal/DateField';
import DateDialog from './internal/DateDialog';
// import type { Handler } from '../types';

type Props = {
  isDisabled: boolean,
  disabled: Array<string>,
  onChange: Handler,
};

type State = {
  value: ?string,
  displayValue: string,
  isOpen: boolean,
};

export default class DatePicker extends Component<Props, State> {
  props: Props;
  picker: any;

  static defaultProps = {
    isDisabled: false,
    disabled: [],
    onChange() {},
  }

  state = {
    value: null,
    displayValue: '',
    isOpen: false,
  };

  handleInputChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      this.setState({ displayValue: e.target.value });
    }
  }

  handleTriggerOpen = () => {
    this.setState({ isOpen: true });
  }

  handleTriggerClose = () => {
    this.setState({ isOpen: false });
    this.picker.selectField();
  }

  handleIconClick = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
      this.picker.selectField();
    } else {
      this.setState({ isOpen: true });
    }
  }

  handleUpdate = (iso: string) => {
    this.setState({
      isOpen: false,
      value: iso,
      displayValue: iso,
    });
    this.picker.selectField();
  }

  render() {
    return (
      <BasePicker
        isOpen={this.state.isOpen}
        displayValue={this.state.displayValue}
        value={this.state.value}

        shouldShowIcon
        field={DateField}
        dialog={DateDialog}
        onFieldChange={this.handleInputChange}
        onFieldTriggerOpen={this.handleTriggerOpen}
        onIconClick={this.handleIconClick}
        onPickerTriggerClose={this.handleTriggerClose}
        onPickerUpdate={this.handleUpdate}

        ref={ref => { this.picker = ref; }}
      />
    );
  }
}
