// @flow

import React, { Component, type ElementRef } from 'react';
import TimePickerStateless from './TimePickerStateless';
import type { Event, Handler } from '../types';
import { parseTime } from '../util';

const defaultTimes = [
  '9:00am',
  '9:30am',
  '10:00am',
  '10:30am',
  '11:00am',
  '11:30am',
  '12:00pm',
  '12:30pm',
  '1:00pm',
  '1:30pm',
  '2:00pm',
  '2:30pm',
  '3:00pm',
  '3:30pm',
  '4:00pm',
  '4:30pm',
  '5:00pm',
  '5:30pm',
  '6:00pm',
];

type Props = {
  autoFocus: boolean,
  isDisabled: boolean,
  times: Array<string>,
  width: ?number,
  onChange: Handler,
};

type State = {
  value: ?string,
  displayValue: string,
  focused: ?string,
  isOpen: boolean,
  times: Array<string>,
};

export default class DatePicker extends Component<Props, State> {
  timepicker: ?ElementRef<typeof TimePickerStateless>;

  static defaultProps = {
    autoFocus: false,
    isDisabled: false,
    times: defaultTimes,
    width: null,
    onChange() {},
  };

  state = {
    value: null,
    displayValue: '',
    focused: null,
    isOpen: false,
    times: this.props.times,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.times !== this.props.times) {
      this.updatetimes(this.state.value, nextProps.times);
    }
  }

  onChange = (value: ?string) => {
    if (value !== this.state.value) {
      this.props.onChange(value);
    }
  };

  handleInputBlur = () => {
    this.validate(this.state.displayValue);
  };

  handleInputChange = (e: Event) => {
    const value = e.target.value;
    this.setState({ displayValue: value });
    this.updatetimes(value, this.props.times);
  };

  handleInputKeyDown = (e: KeyboardEvent) => {
    // Handle opening the dialog, keyboard nav, closing the dialog, enter
    if (!this.state.isOpen) {
      if (e.key === 'ArrowDown') {
        this.openDialog();
      } else if (e.key === 'Enter') {
        this.validate(this.state.displayValue);
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

  validate(value: string) {
    const parsedTime = parseTime(value);

    if (parsedTime) {
      this.onChange(parsedTime);
      this.setState({
        value: parsedTime,
        displayValue: parsedTime,
        isOpen: false,
      });
    } else {
      // TODO: Display an error message
      this.onChange(null);
      this.setState({
        value: null,
        displayValue: '',
        isOpen: false,
      });
      this.updatetimes('', this.props.times);
    }
  }

  updatetimes = (value: ?string, times: Array<string>) => {
    const timeShouldBeVisible = (time: string) =>
      value ? time.startsWith(value) : true;
    const filteredTimes = value ? times.filter(timeShouldBeVisible) : times;
    this.setState({ times: filteredTimes });

    if (!this.state.focused || !timeShouldBeVisible(this.state.focused)) {
      this.setState({
        focused: filteredTimes.length > 0 ? filteredTimes[0] : null,
      });
    }
  };

  openDialog() {
    const times = this.state.times;
    this.setState({
      focused: times.length ? times[0] : null,
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

  render() {
    return (
      <TimePickerStateless
        autoFocus={this.props.autoFocus}
        isDisabled={this.props.isDisabled}
        isOpen={this.state.isOpen}
        displayValue={this.state.displayValue}
        value={this.state.value}
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
