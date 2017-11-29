// @flow

import React, { Component } from 'react';
import { gridSize } from '@atlaskit/theme';
import DateField from './internal/DateField';
import DateDialog from './internal/DateDialog';
import DateTimePickerStateless from './DateTimePickerStateless';
import TimeField from './internal/TimeField';
import TimeDialog from './internal/TimeDialog';
import type { Handler } from '../types';
import { parseDate, parseTime } from '../util';

const noop = () => {};

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
  disabled: Array<string>,
  times: Array<string>,
  width: number,
  onChange: Handler,
};

type State = {
  active: 0 | 1 | 2,
  value: [?string, ?string],
  displayValue: [string, string],
  isOpen: boolean,
  focused: ?string,
  visibleTimes: Array<string>,
};

export default class DateTimePicker extends Component<Props, State> {
  dualPicker: any;

  static defaultProps = {
    isDisabled: false,
    disabled: [],
    times: defaultTimes,
    width: gridSize() * 30,
    onChange() {},
  };

  state = {
    active: 0,
    value: [null, null],
    displayValue: ['', ''],
    isOpen: false,
    focused: null,
    visibleTimes: this.props.times,
  };

  onChange = (dateValue: ?string, timeValue: ?string) => {
    if (dateValue && timeValue) {
      this.props.onChange(`${dateValue} ${timeValue}`);
    }
  };

  handleBlur = () => {
    if (!this.state.isOpen && this.state.active !== 1) {
      this.setState({ active: 0 });
    }
  };

  // DatePicker

  onDateChange = (value: string) => {
    if (value !== this.state.value[0]) {
      this.onChange(value, this.state.value[1]);
    }
  };

  handleDateInputBlur = (e: FocusEvent) => {
    if (e.target instanceof HTMLInputElement) {
      this.validateDate();
    }
  };

  handleDateInputFocus = () => {
    this.setState({ active: 1 });
  };

  handleDateInputChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      const value = e.target.value;
      this.setState(prevState => ({
        displayValue: [value, prevState.displayValue[1]],
      }));
    }
  };

  handleDateTriggerOpen = () => {
    this.setState({ isOpen: true });
  };

  handleDateTriggerClose = () => {
    this.setState({ isOpen: false });
    this.selectDateField();
  };

  handleDateTriggerValidate = () => {
    this.validateDate();
    this.selectTimeField();
  };

  handleIconClick = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
      if (this.state.active === 1) {
        this.selectDateField();
      } else {
        this.selectTimeField();
      }
    } else {
      this.setState({ isOpen: true });
      if (this.state.active === 0) {
        this.setState({ active: 1 });
      }
    }
  };

  handleDatePickerBlur = () => {
    this.setState({ isOpen: false });
  };

  handleDateUpdate = (iso: string) => {
    const parsedDate = parseDate(iso);
    if (parsedDate) {
      this.onDateChange(parsedDate.value);
      this.setState(prevState => ({
        isOpen: false,
        displayValue: [parsedDate.display, prevState.displayValue[1]],
        value: [parsedDate.value, prevState.value[1]],
      }));
      this.selectTimeField();
    }
  };

  validateDate() {
    const parsedDate = parseDate(this.state.displayValue[0]);

    if (parsedDate) {
      this.onDateChange(parsedDate.value);
      this.setState(prevState => ({
        value: [parsedDate.value, prevState.value[1]],
        displayValue: [parsedDate.display, prevState.displayValue[1]],
      }));
    } else {
      // TODO: Display error message for invalid date.
      this.setState(prevState => ({
        value: [null, prevState.value[1]],
        displayValue: ['', prevState.displayValue[1]],
      }));
    }
  }

  selectDateField() {
    if (this.dualPicker) {
      this.dualPicker.selectField1();
    }
  }

  // TimePicker

  onTimeChange = (value: string) => {
    if (value !== this.state.value[1]) {
      this.onChange(this.state.value[0], value);
    }
  };

  handleTimeInputBlur = (e: FocusEvent) => {
    if (e.target instanceof HTMLInputElement) {
      this.validateTime(this.state.displayValue[1]);
    }
  };

  handleTimeInputFocus = () => {
    this.setState({ active: 2 });
  };

  handleTimeInputChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      const value = e.target.value;
      this.setState(prevState => ({
        displayValue: [prevState.displayValue[0], value],
      }));
      this.updateVisibleTimes(value, this.props.times);
    }
  };

  handleTimeInputKeyDown = (e: KeyboardEvent) => {
    // Handle opening the dialog, keyboard nav, closing the dialog, enter
    if (!this.state.isOpen) {
      if (e.key === 'ArrowDown') {
        this.openDialog();
      } else if (e.key === 'Enter') {
        this.validateTime(this.state.displayValue[1]);
      }
    } else if (e.key === 'Escape') {
      this.setState({ isOpen: false });
    } else if (e.key === 'ArrowDown') {
      this.selectNextItem();
    } else if (e.key === 'ArrowUp') {
      this.selectPreviousItem();
    } else if (e.key === 'Enter') {
      if (this.state.focused) {
        this.validateTime(this.state.focused);
      }
    }
  };

  // handleIconClick = () => {
  //   if (this.state.isOpen) {
  //     this.setState({ isOpen: false });
  //   } else {
  //     this.openDialog();
  //   }
  //   this.selectField();
  // }

  handleTimeUpdate = (time: string) => {
    this.validateTime(time);
  };

  validateTime(value: string) {
    const parsedTime = parseTime(value);

    if (parsedTime) {
      this.onTimeChange(parsedTime);
      this.setState(prevState => ({
        value: [prevState.value[0], parsedTime],
        displayValue: [prevState.displayValue[0], parsedTime],
        isOpen: false,
      }));
    } else {
      // TODO: Display an error message
      this.setState(prevState => ({
        value: [prevState.value[0], null],
        displayValue: [prevState.displayValue[0], ''],
        isOpen: false,
      }));
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

  selectTimeField() {
    if (this.dualPicker) {
      this.dualPicker.selectField2();
    }
  }

  render() {
    return (
      <DateTimePickerStateless
        active={this.state.active}
        isDisabled={this.props.isDisabled}
        isOpen={this.state.isOpen}
        shouldShowIcon
        displayValue={this.state.displayValue}
        value={this.state.value}
        dialogProps={[
          { dialog: this.props.disabled },
          { times: this.state.visibleTimes, value: this.state.focused },
        ]}
        width={this.props.width}
        onIconClick={this.handleIconClick}
        onBlur={this.handleBlur}
        onFieldBlur={[this.handleDateInputBlur, this.handleTimeInputBlur]}
        onFieldFocus={[this.handleDateInputFocus, this.handleTimeInputFocus]}
        onFieldChange={[this.handleDateInputChange, this.handleTimeInputChange]}
        onFieldKeyDown={[noop, this.handleTimeInputKeyDown]}
        onFieldTriggerOpen={[this.handleDateTriggerOpen, noop]}
        onFieldTriggerValidate={[this.handleDateTriggerValidate, noop]}
        onPickerBlur={[this.handleDatePickerBlur, noop]}
        onPickerTriggerClose={[this.handleDateTriggerClose, noop]}
        onPickerUpdate={[this.handleDateUpdate, this.handleTimeUpdate]}
        dialogs={[DateDialog, TimeDialog]}
        fields={[DateField, TimeField]}
        ref={ref => {
          this.dualPicker = ref;
        }}
      />
    );
  }
}
