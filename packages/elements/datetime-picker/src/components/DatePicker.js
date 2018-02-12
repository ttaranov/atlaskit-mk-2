// @flow

import Calendar from '@atlaskit/calendar';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
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
  view: string,
};

function isoToObj(iso) {
  const parsed = parse(iso);
  return isValid(parsed)
    ? {
        day: parsed.getDate(),
        month: parsed.getMonth() + 1,
        year: parsed.getFullYear(),
      }
    : {};
}

/*

TODO

- DateTimePicker's DatePicker should behave like the normal DatePicker (keyboard nav / select is off).
- Pickers should not open the dropdown until you start typing, so it can autocomplete (requires react-select isOpen).
- Look and feel should be restored to originals, for now.
- ReactSelect should have an option to disable the auto-width of the Menu component.
- ReactSelect needs an event for when the clear button is clicked, when controlling the value.
- ReactSelect needs a way to control the open / closed state of the dropdown.
- ReactSelect neesd a way to control the focused item in the dropdown.
- ReactSelect forces input with to match dropdown. This breaks `flex-basis: 0` in DateTimePicker.
- Tests!

*/

const arrowKeys = {
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
};

const ClearIndicator = null;
const DropdownIndicator = () => (
  <span role="img">
    <CalendarIcon />
  </span>
);

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
    view: '',
  };

  onCalendarChange = ({ iso }: Object) => {
    this.setState({ view: iso });
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
    this.setState({ view: '' });
    this.onCalendarSelect({ iso: value });
  };

  onSelectKeyDown = (e: Event) => {
    const { key } = e;
    const dir = arrowKeys[key];

    if (dir) {
      if (this.calendar) {
        this.calendar.navigate(dir);
      }
    } else if (key === 'Escape') {
      this.setState({ value: '' });
    } else if (key === 'Enter' || key === 'Tab') {
      const value = this.state.view;
      this.setState({ value });
      this.onCalendarSelect({ iso: value });
    }
  };

  refCalendar = e => {
    this.calendar = e;
  };

  render() {
    const { autoFocus, isDisabled, name } = this.props;
    const { value, view } = this.state;

    const Menu = () => (
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '1px 5px 10px #eee',
          overflow: 'hidden',
          position: 'absolute',
          textAlign: 'center',
          zIndex: 1000,
        }}
      >
        <Calendar
          {...isoToObj(value)}
          {...isoToObj(view)}
          onChange={this.onCalendarChange}
          onSelect={this.onCalendarSelect}
          ref={this.refCalendar}
          selected={[value]}
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
          components={{ ClearIndicator, DropdownIndicator, Menu }}
          isDisabled={isDisabled}
          placeholder="e.g. 2018/12/31"
          value={
            value && {
              label: format(parse(value), 'YYYY/MM/DD'),
              value,
            }
          }
        />
      </div>
    );
  }
}

export default withCtrl(DatePicker);
