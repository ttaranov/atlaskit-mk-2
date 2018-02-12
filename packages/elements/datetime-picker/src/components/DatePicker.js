// @flow

import Calendar from '@atlaskit/calendar';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import Select from '@atlaskit/select';
import { format, isValid, parse } from 'date-fns';
import React, { Component } from 'react';
import withCtrl from 'react-ctrl';
import styled from 'styled-components';

import { ClearIndicator, DropdownIndicator } from '../internal';
import type { Event } from '../types';

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
  /** The icon to show in the field. */
  icon?: typeof Component,
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

Pickers

- Focus does not open the dropdowns.
- Down arrow or input opens dropdown. Left / right keys navigate the caret.
- When dropdown is open, keyboard nav navigates the list, but prevents caret movement.
- DateTimePicker positioning of dropdowns needs slight moving, but requires styling hooks.
- Tests!

ReactSelect

- ReactSelect should have an option to disable the auto-width of the Menu component.
- ReactSelect needs an event for when the clear button is clicked, when controlling the value.
- ReactSelect needs a way to control the open / closed state of the dropdown.
- ReactSelect forces input width to match dropdown. This breaks `flex-basis: 0` in DateTimePicker.

*/

const arrowKeys = {
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
};

const StyledMenu = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 1px 5px 10px #eee;
  margin-top: 7px;
  overflow: hidden;
  position: absolute;
  text-align: center;
  z-index: 1000;
`;

class DatePicker extends Component<Props, State> {
  calendar: Calendar;

  static defaultProps = {
    autoFocus: false,
    disabled: [],
    icon: CalendarIcon,
    name: '',
    isDisabled: false,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
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
    const { icon, name, ...rest } = this.props;
    const { value, view } = this.state;

    const Menu = () => (
      <StyledMenu>
        <Calendar
          {...isoToObj(value)}
          {...isoToObj(view)}
          onChange={this.onCalendarChange}
          onSelect={this.onCalendarSelect}
          ref={this.refCalendar}
          selected={[value]}
        />
      </StyledMenu>
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
          {...rest}
          components={{
            ClearIndicator,
            DropdownIndicator: () => <DropdownIndicator icon={icon} />,
            Menu,
          }}
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
