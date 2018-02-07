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
  name: string,
  /** Called when the value changes. The only argument is an ISO time. */
  onChange: Handler,
  /** The ISO time that should be used as the input value. */
  value?: string,
};

type State = {
  isOpen: boolean,
  value: string,
  view: { month?: number, year?: number },
};

/*

TODO

- Figure out why calendar is clearing the value on escape when the value isn't changing.
- Calendar needs a way to pass keyboard events to it when not focused (and possibly return if it wasn't handled).
- DateTime picker should force 50% width of flex children.
- Navigate the calendar when keys are pressed while maintaining focus on the input.
- ReactSelect needs a way to control the open / closed state of the dropdown.
- ReactSelect needs a way to control the value of the input.
- ReactSelect neesd a way to control the focused item in the dropdown.
- ReactSelect's onInputChange fires onKeyDown as opposed to onKeyUp meaning the value that comes back isn't what's in the input.
- Tests!
- Timezones!

*/

const arrowKeys = {
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
};

class DatePicker extends Component<Props, State> {
  calendar: Calendar;

  static defaultProps = {
    autoFocus: false,
    disabled: [],
    name: '',
    isDisabled: false,
    onChange: () => {},
  };

  state = {
    isOpen: false,
    value: '',
    view: {},
  };

  onKeyUp = (e: Event) => {
    let value = e.target.value;
    if (value) {
      const parsed = parse(value);
      if (isValid(parsed)) {
        value = format(parsed, 'YYYY-MM-DD');
      }
    }
    this.setState({ view: {} });
    this.onCalendarSelect({ iso: value });
  };

  onCalendarChange = ({ month, year }: Object) => {
    this.setState({ view: { month, year } });
  };

  onCalendarSelect = ({ iso: value }: Object) => {
    this.setState({ value });
    this.props.onChange(value);
  };

  refCalendar = e => {
    this.calendar = e;
  };

  render() {
    const { autoFocus, isDisabled, name } = this.props;
    const { value, view } = this.state;
    const parsed = parse(value);

    let calendarProps = {};
    if (isValid(parsed)) {
      calendarProps = {
        focused: parsed.getDate(),
        month: parsed.getMonth() + 1,
        selected: [value],
        year: parsed.getFullYear(),
      };
    }

    const Menu = () => (
      <Calendar
        {...calendarProps}
        {...view}
        onChange={this.onCalendarChange}
        onSelect={this.onCalendarSelect}
        ref={this.refCalendar}
      />
    );

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
