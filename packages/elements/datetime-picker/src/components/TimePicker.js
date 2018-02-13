// @flow

import Select from '@atlaskit/select';
import { format, isValid, parse } from 'date-fns';
import React, { Component } from 'react';
import withCtrl from 'react-ctrl';

import { ClearIndicator, defaultTimes, DropdownIndicator } from '../internal';

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
  /** The icon to show in the field. */
  icon: boolean,
  /** Whether or not the field is disabled. */
  isDisabled: boolean,
  /** Whether or not the dropdown is open. */
  isOpen?: boolean,
  /** The name of the field. */
  name: string,
  /** Called when the field is blurred. */
  onBlur: () => void,
  /** Called when the value changes. The only argument is an ISO time. */
  onChange: string => void,
  /** Called when the field is focused. */
  onFocus: () => void,
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
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
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

  onChange = (v: Object | null): void => {
    const value = v ? v.value : '';
    this.setState({ value });
    this.props.onChange(value);
  };

  render() {
    const { icon, name, ...rest } = this.props;
    const { value } = this.state;
    return (
      <div>
        <input name={name} type="hidden" value={value} />
        {/* $FlowFixMe - complaining about required args that aren't required. */}
        <Select
          {...rest}
          components={{
            ClearIndicator,
            DropdownIndicator: () => <DropdownIndicator icon={icon} />,
          }}
          onChange={this.onChange}
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
