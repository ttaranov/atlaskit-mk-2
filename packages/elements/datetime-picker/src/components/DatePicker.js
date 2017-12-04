// @flow

import React, { Component, type ElementRef } from 'react';
import { gridSize } from '@atlaskit/theme';
import DatePickerStateless from './DatePickerStateless';
import type { Handler } from '../types';
import { parseDate } from '../util';

type Props = {
  isDisabled: boolean,
  disabled: Array<string>,
  onChange: Handler,
  width: number,
};

type State = {
  value: ?string,
  displayValue: string,
  isOpen: boolean,
};

export default class DatePicker extends Component<Props, State> {
  datepicker: ?ElementRef<typeof DatePickerStateless>;

  static defaultProps = {
    isDisabled: false,
    disabled: [],
    onChange() {},
    width: gridSize() * 20,
  };

  state = {
    value: null,
    displayValue: '',
    isOpen: false,
  };

  onChange = (value: string) => {
    if (value !== this.state.value) {
      this.props.onChange(value);
    }
  };

  handleInputBlur = (e: FocusEvent) => {
    if (e.target instanceof HTMLInputElement) {
      this.validate();
    }
  };

  handleInputChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      this.setState({ displayValue: e.target.value });
    }
  };

  handleTriggerValidate = () => {
    this.validate();
  };

  handleTriggerOpen = () => {
    this.setState({ isOpen: true });
  };

  handleTriggerClose = () => {
    this.setState({ isOpen: false });
    this.selectField();
  };

  handleIconClick = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
      this.selectField();
    } else {
      this.setState({ isOpen: true });
    }
  };

  handlePickerBlur = () => {
    this.setState({ isOpen: false });
  };

  handleUpdate = (iso: string) => {
    const parsedDate = parseDate(iso);
    if (parsedDate) {
      this.onChange(parsedDate.value);
      this.setState({
        isOpen: false,
        displayValue: parsedDate.display,
        value: parsedDate.value,
      });
      this.selectField();
    }
  };

  // TODO: Check that the date is not disabled
  validate() {
    const parsedDate = parseDate(this.state.displayValue);

    if (parsedDate) {
      this.onChange(parsedDate.value);
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

  selectField() {
    if (this.datepicker) {
      this.datepicker.selectField();
    }
  }

  render() {
    return (
      <DatePickerStateless
        isDisabled={this.props.isDisabled}
        isOpen={this.state.isOpen}
        shouldShowIcon
        displayValue={this.state.displayValue}
        value={this.state.value}
        disabled={this.props.disabled}
        width={this.props.width}
        onFieldBlur={this.handleInputBlur}
        onFieldChange={this.handleInputChange}
        onFieldTriggerOpen={this.handleTriggerOpen}
        onFieldTriggerValidate={this.handleTriggerValidate}
        onIconClick={this.handleIconClick}
        onPickerBlur={this.handlePickerBlur}
        onPickerTriggerClose={this.handleTriggerClose}
        onPickerUpdate={this.handleUpdate}
        ref={ref => {
          this.datepicker = ref;
        }}
      />
    );
  }
}
