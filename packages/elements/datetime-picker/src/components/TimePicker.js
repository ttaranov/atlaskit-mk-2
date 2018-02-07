// @flow

import Select from '@atlaskit/select';
import { format, isValid, parse } from 'date-fns';
import React, { Component } from 'react';
import withCtrl from 'react-ctrl';
import type { Handler } from '../types';

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

type Option = {
  label: string,
  value: string,
};

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
  /** Whether or not the field is disabled. */
  isDisabled: boolean,
  /** Whether or not the dropdown is open. */
  isOpen?: boolean,
  /** The name of the field. */
  name: string,
  /** Called when the value changes. The only argument is an ISO time. */
  onChange: Handler,
  /** The times to show in the dropdown. */
  times?: Array<string>,
  /** The ISO time that should be used as the input value. */
  value?: string,
};

type State = {
  isOpen: boolean,
  times: Array<string>,
  value: string,
};

function dateFromTime(time: string): Date {
  const [h, m] = time.match(/(\d\d):(\d\d)/) || [];
  return h && m ? parse(`0000-00-00T${h}:${m}`) : new Date('invalid date');
}

function formatTime(time: string): string {
  const date = dateFromTime(time);
  return isValid(date) ? format(date, 'h:mma') : time;
}

class TimePicker extends Component<Props, State> {
  static defaultProps = {
    autoFocus: false,
    isDisabled: false,
    name: '',
    onChange: () => {},
  };

  state = {
    isOpen: false,
    times: defaultTimes,
    value: '',
  };

  getOptions(): Array<Option> {
    return this.state.times.reduce((prev: Array<Option>, curr: string): Array<
      Option,
    > => {
      return prev.concat({
        label: formatTime(curr),
        value: curr,
      });
    }, []);
  }

  handleChange = (v: Object | null): void => {
    const value = v ? v.value : '';
    this.setState({ value });
    this.props.onChange(value);
  };

  render() {
    const { autoFocus, isDisabled, name } = this.props;
    const { value } = this.state;
    return (
      <div>
        <input name={name} type="hidden" value={value} />
        {/* $FlowFixMe - complaining about required args that aren't required. */}
        <Select
          autoFocus={autoFocus}
          isDisabled={isDisabled}
          onChange={this.handleChange}
          options={this.getOptions()}
          placeholder="e.g. 9:00am"
          value={
            value && {
              label: formatTime(value),
              value,
            }
          }
        />
      </div>
    );
  }
}

export default withCtrl(TimePicker);
