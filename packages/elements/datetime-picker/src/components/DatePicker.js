// @flow

import React, { Component, type ElementRef } from 'react';
import withCtrl from 'react-ctrl';
import DatePickerStateless from './DatePickerStateless';
import type { Event, Handler } from '../types';
import { formatDate, parseDate } from '../util';

type Props = {
  autoFocus: boolean,
  disabled: Array<string>,
  formatValue: string => string,
  isDisabled: boolean,
  onChange: Handler,
  width: number,
};

type State = {
  isOpen: boolean,
  value: string,
};

function parse(date: string): string {
  const parsed = parseDate(date);
  return parsed ? parsed.value : '';
}

class DatePicker extends Component<Props, State> {
  datepicker: ?ElementRef<typeof DatePickerStateless>;

  static defaultProps = {
    autoFocus: false,
    disabled: [],
    formatValue: date => formatDate(date),
    isDisabled: false,
    onChange: () => {},
    width: null,
  };

  state = {
    isOpen: false,
    value: '',
  };

  handleFieldBlur = (e: Event) => {
    const parsed = parse(e.target.value);
    if (parsed) {
      this.props.onChange(parsed);
    }
  };

  handleFieldChange = (e: Event) => {
    const { value } = e.target;
    this.props.onChange(value);
    this.setState({ value });
  };

  handleFieldTriggerOpen = () => {
    this.setState({ isOpen: true });
  };

  handleFieldTriggerValidate = () => {
    this.validate(this.state.value);
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

  handlePickerTriggerClose = () => {
    this.setState({ isOpen: false });
    this.selectField();
  };

  handlePickerUpdate = (value: string) => {
    const parsed = parse(value);
    if (parsed) {
      this.setState({ isOpen: false, value: parsed });
      this.props.onChange(parsed);
      this.selectField();
    }
  };

  selectField() {
    if (this.datepicker) {
      this.datepicker.selectField();
    }
  }

  // TODO: Check that the date is not disabled.
  // TODO: Display error message for invalid date.
  validate(value: string) {
    const parsed = parse(value);
    this.setState({ value: parsed });
    this.props.onChange(parsed);
  }

  render() {
    const { formatValue } = this.props;
    const { value } = this.state;
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
        onFieldBlur={this.handleFieldBlur}
        onFieldChange={this.handleFieldChange}
        onFieldTriggerOpen={this.handleFieldTriggerOpen}
        onFieldTriggerValidate={this.handleFieldTriggerValidate}
        onIconClick={this.handleIconClick}
        onPickerBlur={this.handlePickerBlur}
        onPickerTriggerClose={this.handlePickerTriggerClose}
        onPickerUpdate={this.handlePickerUpdate}
        ref={ref => {
          this.datepicker = ref;
        }}
      />
    );
  }
}

export default withCtrl(DatePicker);
