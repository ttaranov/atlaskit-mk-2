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

- DatePicker layer should be absolute and appear over the content.
- DateTimePicker's DatePicker should behave like the normal DatePicker (keyboard nav / select is off).
- ReactSelect needs an event for when the clear button is clicked, when controlling the value.
- ReactSelect needs a way to control the open / closed state of the dropdown.
- ReactSelect neesd a way to control the focused item in the dropdown.
- ReactSelect forces input with to match dropdown. This breaks `flex-basis: 0` in DateTimePicker.
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

  onCalendarChange = ({ day, iso, month, type, year }: Object) => {
    if (type === 'next' || type === 'prev') {
      this.setState({ view: { month, year } });
    } else {
      this.setState({ value: iso, view: { day, month, year } });
    }
  };

  onCalendarSelect = ({ iso: value }: Object) => {
    this.setState({ value });
    this.props.onChange(value);
  };

  onSelectInput = (e: Event) => {
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

  onSelectKeyDown = (e: Event) => {
    const { key } = e;
    const dir = arrowKeys[key];

    if (dir) {
      // Navigates the calendar using the keyboard.
      if (this.calendar) {
        this.calendar.navigate(dir);
      }
    } else if (key === 'Enter') {
      // TODO close the dropdown once it supports controlled isOpen.
      // This ensures that react-select doesn't do anything with the value and
      // we can retain whatever the user has entered.
      e.preventDefault();
    } else if (key === 'Escape') {
      // TODO close the dropdown once it supports controlled isOpen.
      // Clear the value on escape.
      this.setState({ value: '' });
    } else if (key === 'Tab') {
      // When the tab key is pressed, react-select normally clears the value.
      // However, we want to retain it and allow the dropdown to close.
      this.setState({ value: this.state.value });
    }
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
        day: parsed.getDate(),
        month: parsed.getMonth() + 1,
        selected: [value],
        year: parsed.getFullYear(),
      };
    }

    const MenuList = () => (
      <div style={{ textAlign: 'center' }}>
        <Calendar
          {...calendarProps}
          {...view}
          onChange={this.onCalendarChange}
          onSelect={this.onCalendarSelect}
          ref={this.refCalendar}
        />
      </div>
    );

    return (
      <div
        role="presentation"
        onInput={this.onSelectInput}
        onKeyDown={this.onSelectKeyDown}
      >
        <input name={name} type="hidden" value={value} />
        {/* $FlowFixMe - complaining about required args that aren't required. */}
        <Select
          autoFocus={autoFocus}
          components={{ MenuList }}
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
