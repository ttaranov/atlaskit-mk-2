// @flow

import { isValid } from 'date-fns';
import React, { Component, type ElementRef } from 'react';
import withCtrl from 'react-ctrl';
import TimePickerStateless from './TimePickerStateless';
import type { Event, Handler } from '../types';
import { dateFromTime, formatTime } from '../util';

const defaultTimes = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
];

type Props = {
  /** Whether or not to auto-focus the field. */
  autoFocus: boolean,
  /** A function that returns the formatted value to display. The only argument is an ISO time. */
  formatValue: string => string,
  /** Whether or not the field is disabled. */
  isDisabled: boolean,
  /** Called when the value changes. The only argument is an ISO time. */
  onChange: Handler,
  /** The width of the field. */
  width: number,
};

type State = {
  focused: string,
  isOpen: boolean,
  times: Array<string>,
  value: string,
};

class TimePicker extends Component<Props, State> {
  timepicker: ?ElementRef<typeof TimePickerStateless>;

  static defaultProps = {
    autoFocus: false,
    formatValue: time => formatTime(time),
    isDisabled: false,
    onChange: () => {},
    width: null,
  };

  state = {
    focused: '',
    isOpen: false,
    times: defaultTimes,
    value: '',
  };

  handleInputBlur = () => {
    this.validate(this.state.value);
  };

  handleInputChange = (e: Event) => {
    const value = e.target.value;
    this.setState({ value });
    this.updateTimes(value, this.state.times);
  };

  handleInputKeyDown = (e: KeyboardEvent) => {
    // Handle opening the dialog, keyboard nav, closing the dialog, enter
    if (!this.state.isOpen) {
      if (e.key === 'ArrowDown') {
        this.openDialog();
      } else if (e.key === 'Enter') {
        this.validate(this.state.value);
      }
    } else if (e.key === 'Escape') {
      this.setState({ isOpen: false });
    } else if (e.key === 'ArrowDown') {
      this.selectNextItem();
    } else if (e.key === 'ArrowUp') {
      this.selectPreviousItem();
    } else if (e.key === 'Enter') {
      if (this.state.focused) {
        this.validate(this.state.focused);
      }
    }
  };

  handleUpdate = (time: string) => {
    this.validate(time);
  };

  onChange = (value: ?string) => {
    if (value !== this.state.value) {
      this.props.onChange(value);
    }
  };

  openDialog() {
    const times = this.state.times;
    this.setState({
      focused: times.length ? times[0] : '',
      isOpen: true,
    });
  }

  selectNextItem() {
    const times = this.state.times;
    const current = this.state.focused ? times.indexOf(this.state.focused) : -1;
    let next = current + 1;
    next = next > times.length - 1 ? 0 : next;
    this.setState({ focused: times[next] });
  }

  selectPreviousItem() {
    const times = this.state.times;
    const current = this.state.focused ? times.indexOf(this.state.focused) : -1;
    let previous = current - 1;
    previous = previous < 0 ? times.length - 1 : previous;
    this.setState({ focused: times[previous] });
  }

  updateTimes = (value: ?string, times: Array<string>) => {
    const timeShouldBeVisible = (time: string) =>
      value ? time.startsWith(value) : true;
    const filteredTimes = value ? times.filter(timeShouldBeVisible) : times;
    this.setState({ times: filteredTimes });

    if (!this.state.focused || !timeShouldBeVisible(this.state.focused)) {
      this.setState({
        focused: filteredTimes.length > 0 ? filteredTimes[0] : '',
      });
    }
  };

  // TODO: Display an error message.
  validate(value: string) {
    if (isValid(dateFromTime(value))) {
      this.props.onChange(value);
      this.setState({
        value,
        isOpen: false,
      });
    } else {
      this.setState({
        value: '',
        isOpen: false,
      });
      this.updateTimes('', this.state.times);
    }
  }

  render() {
    const { formatValue } = this.props;
    const { value } = this.state;
    return (
      <TimePickerStateless
        autoFocus={this.props.autoFocus}
        isDisabled={this.props.isDisabled}
        isOpen={this.state.isOpen}
        displayValue={formatValue(value)}
        value={value}
        times={this.state.times}
        focused={this.state.focused}
        width={this.props.width}
        onFieldBlur={this.handleInputBlur}
        onFieldChange={this.handleInputChange}
        onFieldKeyDown={this.handleInputKeyDown}
        onPickerUpdate={this.handleUpdate}
        ref={ref => {
          this.timepicker = ref;
        }}
      />
    );
  }
}

export default withCtrl(TimePicker);
