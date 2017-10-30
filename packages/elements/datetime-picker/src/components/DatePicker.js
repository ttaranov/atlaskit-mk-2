// @flow

import React, { Component } from 'react';
// import type { EventChange, EventSelect } from '@atlaskit/calendar';
import BasePicker from './internal/Picker';
import DateField from './internal/DateField';
import DateDialog from './internal/DateDialog';
import type { Handler } from '../types';
import { parseDate } from '../util';

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

  handleInputBlur = (e: FocusEvent) => {
    if (e.target instanceof HTMLInputElement) {
      const date = e.target.value;

      const parsedDate = parseDate(date);

      if (parsedDate) {
        this.setState({
          value: parsedDate.value,
          displayValue: parsedDate.display,
        });
      } else {
        // TODO: Display error message for invalid date.
        this.setState({
          value: null,
          displayValue: '',
        });
      }
    }
  }

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

  handlePickerBlur = () => {
    this.setState({ isOpen: false });
  }

  handleUpdate = (iso: string) => {
    const parsedDate = parseDate(iso);
    if (parsedDate) {
      this.setState({
        isOpen: false,
        displayValue: parsedDate.display,
        value: parsedDate.value,
      });
      this.picker.selectField();
    }
  }

  render() {
    return (
      <BasePicker
        isOpen={this.state.isOpen}
        displayValue={this.state.displayValue}
        value={this.state.value}

        isDisabled={this.props.isDisabled}
        dialogProps={{ disabled: this.props.disabled }}

        shouldShowIcon
        field={DateField}
        dialog={DateDialog}
        onFieldBlur={this.handleInputBlur}
        onFieldChange={this.handleInputChange}
        onFieldTriggerOpen={this.handleTriggerOpen}
        onIconClick={this.handleIconClick}
        onPickerBlur={this.handlePickerBlur}
        onPickerTriggerClose={this.handleTriggerClose}
        onPickerUpdate={this.handleUpdate}

        ref={ref => { this.picker = ref; }}
      />
    );
  }
}
