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
  input: Element | null;

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
    this.triggerChange(value);
    this.setState({ isOpen: false });
  };

  onInputBlur = () => {
    this.setState({ isOpen: false });
  };

  onInputFocus = () => {
    this.setState({ isOpen: true });
  };

  onSelectInput = (e: Event) => {
    let value = e.target.value;
    if (value) {
      const parsed = parse(value);
      if (isValid(parsed)) {
        value = format(parsed, 'YYYY-MM-DD');
        this.triggerChange(value);
      }
    }
    this.setState({ isOpen: true });
  };

  onSelectKeyDown = (e: Event) => {
    const { key } = e;
    const dir = arrowKeys[key];
    const { isOpen, view } = this.state;

    if (dir) {
      // Calendar will not exist if it's not open and this also doubles as a
      // ref check since it may not exist.
      if (this.calendar) {
        // We don't want to move the caret if the calendar is open.
        if (dir === 'left' || dir === 'right') {
          e.preventDefault();
        }
        this.calendar.navigate(dir);
      } else if (dir === 'down' || dir === 'up') {
        this.setState({ isOpen: true });
      }
    } else if (key === 'Escape') {
      if (isOpen) {
        this.setState({ isOpen: false });
      } else {
        this.triggerChange('');
      }
    } else if (key === 'Enter' || key === 'Tab') {
      this.triggerChange(view);

      // TODO see if there's a different way to control the display value.
      //
      // react-select retains the value the user typed in until the field is
      // blurred. Since we're controlling the open state and value, we need a
      // way explicitly ensure the value is respected. By blurring and then
      // immedately refocusing, we ensure the value is formatted and the input
      // retains focus.
      if (key === 'Enter') {
        e.target.blur();
        e.target.focus();
      }
    }
  };

  refCalendar = e => {
    this.calendar = e;
  };

  triggerChange = value => {
    this.props.onChange(value);
    this.setState({ value, view: value });
  };

  render() {
    const { icon, name } = this.props;
    const { autoFocus, isDisabled, onBlur, onFocus } = this.props;
    const { isOpen, value, view } = this.state;
    const Menu = () =>
      isOpen ? (
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
      ) : null;

    return (
      <div
        role="presentation"
        onBlur={this.onInputBlur}
        onFocus={this.onInputFocus}
        onInput={this.onSelectInput}
        onKeyDown={this.onSelectKeyDown}
      >
        <input name={name} type="hidden" value={value} />
        {/* $FlowFixMe - complaining about required args that aren't required. */}
        <Select
          autoFocus={autoFocus}
          isDisabled={isDisabled}
          onBlur={onBlur}
          onFocus={onFocus}
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
