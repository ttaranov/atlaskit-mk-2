// @flow

import React, { Component } from 'react';
import withCtrl from 'react-ctrl';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import DateField from './internal/DateField';
import DateDialog from './internal/DateDialog';
import DateTimePickerStateless from './DateTimePickerStateless';
import TimeField from './internal/TimeField';
import TimeDialog from './internal/TimeDialog';
import { formatDate, formatTime, parseDate, parseTime } from '../util';
import type { Event } from '../types';

const noop = () => {};

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

function formatValue([date, time]: [string, string]): [string, string] {
  return [formatDate(date), formatTime(time)];
}

/* eslint-disable react/no-unused-prop-types */
type Props = {
  /** Whether or not to auto-focus the field. */
  autoFocus: boolean,
  /** Default for `focused`. */
  defaultFocused?: string,
  /** Default for `isOpen`. */
  defaultIsOpen?: boolean,
  /** Default for `times`. */
  defaultTimes?: Array<string>,
  /** Default for `value`. */
  defaultValue?: string,
  /** An array of ISO dates that should be disabled on the calendar. */
  disabled: Array<string>,
  /** Whether or not the field is disabled. */
  isDisabled: boolean,
  /** Whether or not the dropdown is open. */
  isOpen?: boolean,
  /** The time in the dropdown that should be focused. */
  focused?: string,
  /** Called when the value changes. The first argument is an ISO date and the second is an ISO time. */
  onChange: (date: ?string, time: ?string) => void,
  /** The times to show in the dropdown. */
  times?: Array<string>,
  /** The ISO time that should be used as the input value. */
  value?: string,
  /** The width of the field. */
  width: number,
};

type State = {
  active: 0 | 1 | 2,
  focused: string,
  isOpen: boolean,
  times: Array<string>,
  value: any,
};

class DateTimePicker extends Component<Props, State> {
  dateTimePicker: any;

  static defaultProps = {
    autoFocus: false,
    disabled: [],
    isDisabled: false,
    onChange() {},
    width: 0,
  };

  state = {
    active: 0,
    focused: '',
    isOpen: false,
    times: defaultTimes,
    value: ['', ''],
  };

  onChange = (date: string, time: string) => {
    this.props.onChange(date, time);
  };

  handleBlur = () => {
    if (!this.state.isOpen && this.state.active !== 1) {
      this.setState({ active: 0 });
    }
  };

  // DatePicker

  onDateChange = (value: string) => {
    if (value !== this.state.value[0]) {
      this.setState(prevState => ({
        value: [value, prevState.value[1]],
      }));
      this.onChange(value, this.state.value[1]);
    }
  };

  handleDateInputBlur = () => {
    this.validateDate(this.state.value[0]);
  };

  handleDateInputFocus = () => {
    this.setState({ active: 1 });
  };

  handleDateInputChange = (e: Event) => {
    const value = e.target.value;
    this.setState(prevState => ({
      value: [value, prevState.value[1]],
    }));
  };

  handleDateTriggerOpen = () => {
    this.setState({ isOpen: true });
  };

  handleDateTriggerClose = () => {
    this.setState({ isOpen: false });
    this.selectDateField();
  };

  handleDateTriggerValidate = () => {
    this.validateDate(this.state.value[0]);
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
    const isDateValid = this.validateDate(iso);
    if (isDateValid) {
      this.selectTimeField();
    }
  };

  // TODO: Display error message for invalid date.
  validateDate(date: string) {
    const parsedDate = parseDate(date);

    if (parsedDate) {
      this.onDateChange(date);
      this.setState(prevState => ({
        value: [date, prevState.value[1]],
      }));

      return true;
    }
    this.onDateChange('');
    this.setState(prevState => ({
      value: ['', prevState.value[1]],
    }));

    return false;
  }

  selectDateField() {
    if (this.dateTimePicker) {
      this.dateTimePicker.selectDateField();
    }
  }

  // TimePicker

  onTimeChange = (value: string) => {
    if (value !== this.state.value[1]) {
      this.setState(prevState => ({
        value: [prevState.value[0], value],
      }));
      this.onChange(this.state.value[0], value);
    }
  };

  handleTimeInputBlur = () => {
    this.validateTime(this.state.value[1]);
  };

  handleTimeInputFocus = () => {
    this.setState({ active: 2 });
  };

  handleTimeInputChange = (e: Event) => {
    const value = e.target.value;
    this.setState(prevState => ({
      value: [prevState.value[0], value],
    }));
    this.updateTimes(value, this.state.times);
  };

  handleTimeInputKeyDown = (e: KeyboardEvent) => {
    // Handle opening the dialog, keyboard nav, closing the dialog, enter
    if (!this.state.isOpen) {
      if (e.key === 'ArrowDown') {
        this.openDialog();
      } else if (e.key === 'Enter') {
        this.validateTime(this.state.value[1]);
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

  handleTimeUpdate = (time: string) => {
    this.validateTime(time);
  };

  validateTime(value: string) {
    const parsedTime = parseTime(value);

    if (parsedTime) {
      this.onTimeChange(value);
      this.setState(prevState => ({
        value: [prevState.value[0], value],
        isOpen: false,
      }));
    } else {
      // TODO: Display an error message
      this.onTimeChange('');
      this.setState(prevState => ({
        value: [prevState.value[0], ''],
        isOpen: false,
      }));
      this.updateTimes('', this.state.times);
    }
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

  selectTimeField() {
    if (this.dateTimePicker) {
      this.dateTimePicker.selectTimeField();
    }
  }

  render() {
    const { value } = this.state;
    return (
      <DateTimePickerStateless
        active={this.state.active}
        autoFocus={this.props.autoFocus}
        isDisabled={this.props.isDisabled}
        isOpen={this.state.isOpen}
        shouldShowIcon
        displayValue={formatValue(value)}
        value={value}
        dialogProps={[
          { dialog: this.props.disabled },
          { times: this.state.times, value: this.state.focused },
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
          this.dateTimePicker = ref;
        }}
      />
    );
  }
}

const DateTimePickerWithoutAnalytics = withCtrl(DateTimePicker);
export { DateTimePickerWithoutAnalytics as DateTimePicker };

export default withAnalyticsContext({
  component: 'date-picker',
  package: packageName,
  version: packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'change',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },
  })(DateTimePickerWithoutAnalytics),
);
