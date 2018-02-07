// @flow

import Calendar from '@atlaskit/calendar';
import Select from '@atlaskit/select';
import { format, isValid, parse } from 'date-fns';
import React, { Component } from 'react';
import withCtrl from 'react-ctrl';
import type { Event, Handler } from '../types';

/* eslint-disable react/no-unused-prop-types */
type Props = {
  /** Whether or not to auto-focus the field. */
  autoFocus: boolean,
  /** Default for `isOpen`. */
  defaultIsOpen?: boolean,
  /** Default for `value`. */
  defaultValue?: string,
  /** An array of ISO dates that should be disabled on the calendar. */
  disabled: Array<string>,
  /** Whether or not the field is disabled. */
  isDisabled: boolean,
  /** Whether or not the dropdown is open. */
  isOpen?: boolean,
  /** The name of the field. */
  name?: string,
  /** Called when the value changes. The only argument is an ISO time. */
  onChange: Handler,
  /** The ISO time that should be used as the input value. */
  value?: string,
  /** The width of the field. */
  width?: number,
};

type State = {
  isOpen: boolean,
  value: string,
};

/*

TODO

- DateTime picker should force 50% width of flex children.
- Navigate the calendar when keys are pressed while maintaining focus on the input.
- ReactSelect needs a way to control the open / closed state of the dropdown.
- ReactSelect needs a way to control the value of the input.
- ReactSelect's onInputChange fires onKeyDown as opposed to onKeyUp meaning the value that comes back isn't what's in the input.

*/

class DatePicker extends Component<Props, State> {
  static defaultProps = {
    autoFocus: false,
    disabled: [],
    isDisabled: false,
    onChange: () => {},
    width: 0,
  };

  state = {
    isOpen: false,
    value: '',
  };

  onKeyUp = (e: Event) => {
    let value = e.target.value;
    if (value) {
      const parsed = parse(value);
      if (isValid(parsed)) {
        value = format(parsed, 'YYYY-MM-DD');
      }
    }
    this.onUpdate(value);
  };

  onUpdate = (value: string) => {
    this.setState({ value });
    this.props.onChange(value);
  };

  render() {
    const { autoFocus, isDisabled, name } = this.props;
    const { value } = this.state;
    const parsed = parse(value);
    let calendarProps = {};
    if (isValid(parsed)) {
      const day = parsed.getDate();
      const month = parsed.getMonth() + 1;
      const year = parsed.getFullYear();
      calendarProps = {
        day,
        focused: day,
        month,
        selected: [value],
        year,
      };
    }
    const Menu = () => <Calendar {...calendarProps} onUpdate={this.onUpdate} />;
    return (
      <div role="presentation" onKeyUp={this.onKeyUp}>
        <input name={name} type="hidden" value={value} />
        {/* $FlowFixMe - complaining about required args that aren't required. */}
        <Select
          autoFocus={autoFocus}
          components={{ Menu }}
          isDisabled={isDisabled}
          placeholder="e.g. 2018/12/31"
          value={
            value && {
              label: format(parsed, 'YYYY/MM/DD'),
              value,
            }
          }
        />
      </div>
    );
  }
}

export default withCtrl(DatePicker);
