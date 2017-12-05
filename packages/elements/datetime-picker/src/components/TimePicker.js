// @flow

import React, { Component, type ElementRef } from 'react';
import { gridSize } from '@atlaskit/theme';
import TimePickerStateless from './TimePickerStateless';
import type { Handler } from '../types';
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
  isDisabled: boolean,
  times: Array<string>,
  width: number,
  onChange: Handler,
};

type State = {
  value: ?string,
  displayValue: string,
  focused: ?string,
  isOpen: boolean,
  visibleTimes: Array<string>,
};

export default class DatePicker extends Component<Props, State> {
  timepicker: ?ElementRef<typeof TimePickerStateless>;

  static defaultProps = {
    isDisabled: false,
    times: defaultTimes,
    width: gridSize() * 20,
    onChange() {},
  };

  state = {
    value: null,
    displayValue: '',
    focused: null,
    isOpen: false,
    visibleTimes: this.props.times,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.times !== this.props.times) {
      this.updateVisibleTimes(this.state.value, nextProps.times);
    }
  }

  onChange = (value: string) => {
    if (value !== this.state.value) {
      this.props.onChange(value);
    }
  };

  handleInputBlur = (e: FocusEvent) => {
    if (e.target instanceof HTMLInputElement) {
      this.validate(this.state.displayValue);
    }
  };

  handleInputChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      const value = e.target.value;
      this.setState({ displayValue: value });
      this.updateVisibleTimes(value, this.props.times);
    }
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
      this.setState({
        value: null,
        displayValue: '',
        isOpen: false,
      });
      this.updateVisibleTimes('', this.props.times);
    }
  }

  updateVisibleTimes = (value: ?string, times: Array<string>) => {
    const timeShouldBeVisible = (time: string) =>
      value ? time.startsWith(value) : true;
    const visibleTimes = value ? times.filter(timeShouldBeVisible) : times;
    this.setState({ visibleTimes });

    if (!this.state.focused || !timeShouldBeVisible(this.state.focused)) {
      this.setState({
        focused: visibleTimes.length > 0 ? visibleTimes[0] : null,
      });
    }
  };

  openDialog() {
    const visibleTimes = this.state.visibleTimes;
    this.setState({
      focused: visibleTimes.length ? visibleTimes[0] : null,
      isOpen: true,
    });
  }

  selectNextItem() {
    const visibleTimes = this.state.visibleTimes;
    const current = this.state.focused
      ? visibleTimes.indexOf(this.state.focused)
      : -1;
    let next = current + 1;
    next = next > visibleTimes.length - 1 ? 0 : next;
    this.setState({ focused: visibleTimes[next] });
  }

  selectPreviousItem() {
    const visibleTimes = this.state.visibleTimes;
    const current = this.state.focused
      ? visibleTimes.indexOf(this.state.focused)
      : -1;
    let previous = current - 1;
    previous = previous < 0 ? visibleTimes.length - 1 : previous;
    this.setState({ focused: visibleTimes[previous] });
  }

  render() {
    return (
      <TimePickerStateless
        isDisabled={this.props.isDisabled}
        isOpen={this.state.isOpen}
        displayValue={this.state.displayValue}
        value={this.state.value}
        times={this.state.visibleTimes}
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
