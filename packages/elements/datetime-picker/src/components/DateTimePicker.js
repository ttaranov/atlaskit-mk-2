// @flow

import React, { Component } from 'react';
import withCtrl from 'react-ctrl';
import styled from 'styled-components';
import { format, parse } from 'date-fns';

import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

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
  /** The name of the field. */
  name?: string,
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
  _dateValue: string,
  _timeValue: string,
  active: 0 | 1 | 2,
  focused: string,
  isOpen: boolean,
  times: Array<string>,
  value: string,
};

const Flex = styled.div`
  display: flex;
`;

const FlexItem = styled.div`
  flex-grow: 1;
`;

function formatDateTimeIntoIso(date: string, time: string): string {
  return `${date}T${time}`;
}

function parseDateIntoStateValues(value) {
  const parsed = parse(value);
  return {
    _dateValue: format(parsed, 'YYYY-MM-DD'),
    _timeValue: format(parsed, 'HH:mm'),
  };
}

class DateTimePicker extends Component<Props, State> {
  static defaultProps = {
    autoFocus: false,
    disabled: [],
    isDisabled: false,
    onChange() {},
    width: 0,
  };

  state = {
    _dateValue: '',
    _timeValue: '',
    active: 0,
    focused: '',
    isOpen: false,
    times: defaultTimes,
    value: '',
  };

  handleDateChange = (_dateValue: string) => {
    this.setState({ _dateValue });
    this.handleValueChange();
  };

  handleTimeChange = (_timeValue: string) => {
    this.setState({ _timeValue });
    this.handleValueChange();
  };

  handleValueChange() {
    const { _dateValue, _timeValue } = this.state;
    if (_dateValue && _timeValue) {
      this.props.onChange(formatDateTimeIntoIso(_dateValue, _timeValue));
    }
  }

  render() {
    const { name } = this.props;
    const { _dateValue, _timeValue, value } = this.state;
    return (
      <Flex>
        <input name={name} type="hidden" value={value} />
        <FlexItem style={{ marginRight: 10 }}>
          <DatePicker onChange={this.handleDateChange} value={_dateValue} />
        </FlexItem>
        <FlexItem>
          <TimePicker onChange={this.handleTimeChange} value={_timeValue} />
        </FlexItem>
      </Flex>
    );
  }
}

export default withCtrl(DateTimePicker, {
  mapPropsToState(props) {
    const { value } = props;
    const overridden = {};
    if (value) {
      const parsed = parseDateIntoStateValues(value);
      overridden._dateValue = parsed._dateValue;
      overridden._timeValue = parsed._timeValue;
    }
    return { ...props, ...overridden };
  },
});
