// @flow

import React, { Component, type ElementRef } from 'react';
import { withValue } from 'react-value';
import DatePickerStateless from './DatePickerStateless';
import type { Event, Handler } from '../types';
import { parseDate } from '../util';

type Props = {
  autoFocus: boolean,
  disabled: Array<string>,
  formatValue: string => string,
  isDisabled: boolean,
  onChange: Handler,
  value: string,
  width: number,
};

type State = {
  isOpen: boolean,
};

function parse(date: string): string {
  return (parseDate(date) || { value: '' }).value;
}

class DatePicker extends Component<Props, State> {
  datepicker: ?ElementRef<typeof DatePickerStateless>;

  static defaultProps = {
    autoFocus: false,
    disabled: [],
    formatValue: date => date.replace(/-/g, '/'),
    isDisabled: false,
    value: '',
    width: null,
  };

  state = {
    isOpen: false,
  };

  handleInputBlur = (e: Event) => {
    this.props.onChange(parse(e.target.value));
  };

  handleInputChange = (e: Event) => {
    this.props.onChange(e.target.value);
  };

  handleTriggerValidate = () => {
    this.validate(this.props.value);
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

  handleUpdate = (value: string) => {
    const parsed = parse(value);
    if (parsed) {
      this.props.onChange(parsed);
      this.setState({ isOpen: false });
      this.selectField();
    }
  };

  // TODO: Check that the date is not disabled.
  // TODO: Display error message for invalid date.
  validate(value?: string) {
    this.props.onChange(parse(value));
  }

  selectField() {
    if (this.datepicker) {
      this.datepicker.selectField();
    }
  }

  render() {
    const { formatValue, value } = this.props;
    return (
      <DatePickerStateless
        autoFocus={this.props.autoFocus}
        isDisabled={this.props.isDisabled}
        isOpen={this.state.isOpen}
        shouldShowIcon
        displayValue={formatValue(value)}
        value={value}
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

export default withValue(DatePicker);
