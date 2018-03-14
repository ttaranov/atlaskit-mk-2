// @flow

import Select from '@atlaskit/select';
import { format, isValid, parse } from 'date-fns';
import React, { Component, type Node } from 'react';
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
  defaultFocused: string,
  /** Default for `isOpen`. */
  defaultIsOpen: boolean,
  /** Default for `times`. */
  defaultTimes: Array<string>,
  /** Default for `value`. */
  defaultValue: string,
  /** The icon to show in the field. */
  icon: Node,
  /** The id of the field. Currently, react-select transforms this to have a "react-select-" prefix, and an "--input" suffix when applied to the input. For example, the id "my-input" would be transformed to "react-select-my-input--input". Keep this in mind when needing to refer to the ID. This will be fixed in an upcoming release. */
  id: string,
  /** Props to apply to the container. **/
  innerProps: Object,
  /** Whether or not the field is disabled. */
  isDisabled: boolean,
  /** Whether or not the dropdown is open. */
  isOpen: boolean,
  /** The name of the field. */
  name: string,
  /** Called when the field is blurred. */
  onBlur: () => void,
  /** Called when the value changes. The only argument is an ISO time. */
  onChange: string => void,
  /** Called when the field is focused. */
  onFocus: () => void,
  /** Props to apply to the select. */
  selectProps: Object,
  /** The times to show in the dropdown. */
  times: Array<string>,
  /** The ISO time that should be used as the input value. */
  value: string,
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
    return this.state.times.map((time: string): Option => {
      return {
        label: formatTime(time),
        value: time,
      };
    });
  }

  onChange = (v: Object | null): void => {
    const value = v ? v.value : '';
    this.setState({ value });
    this.props.onChange(value);
  };

  render() {
    const {
      autoFocus,
      icon,
      id,
      innerProps,
      isDisabled,
      name,
      onBlur,
      onFocus,
      selectProps,
    } = this.props;
    const { value } = this.state;
    return (
      <div {...innerProps}>
        <input name={name} type="hidden" value={value} />
        {/* $FlowFixMe - complaining about required args that aren't required. */}
        <Select
          autoFocus={autoFocus}
          instanceId={id}
          isDisabled={isDisabled}
          onBlur={onBlur}
          onChange={this.onChange}
          options={this.getOptions()}
          onFocus={onFocus}
          components={{
            ClearIndicator,
            DropdownIndicator: () => <DropdownIndicator icon={icon} />,
          }}
          placeholder="e.g. 9:00am"
          value={
            value && {
              label: formatTime(value),
              value,
            }
          }
          {...selectProps}
        />
      </div>
    );
  }
}

export default withCtrl(TimePicker);
