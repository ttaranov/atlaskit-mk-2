// @flow

import React, { Component } from 'react';
import type { EventChange, EventSelect } from '@atlaskit/calendar';
import { parse, format, isValid, getDate, getMonth, getYear } from 'date-fns';
import DatePickerStateless from './DatePickerStateless';
import type { Handler } from '../types';

type Props = {
  isDisabled: boolean,
  disabled: Array<string>,
  onChange: Handler,
};

type State = {
  value: ?string,
  displayValue: string,
  isOpen: bool,
  day: number,
  month: number,
  year: number,
};

export default class DatePicker extends Component<Props, State> {
  props: Props;

  static defaultProps = {
    isDisabled: false,
    disabled: [],
    onChange() {},
  }

  constructor(props: Props) {
    super(props);

    const now = new Date();
    const thisDay = now.getDate();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();

    this.state = {
      isOpen: false,
      value: null,
      displayValue: '',
      day: thisDay,
      month: thisMonth,
      year: thisYear,
      disabled: [],
    };
  }

  handleIconClick = () => {
    if (!this.props.isDisabled) {
      this.setState(prevState => ({
        isOpen: !prevState.isOpen,
      }));
    }
  }

  handleInputBlur = (e: FocusEvent) => {
    // When the focus is shifted away from the input, try and validate its contents. 
    // Do not try to validate the input contents if the calendar is being opened.
    if (!this.state.isOpen && e.target instanceof HTMLInputElement) {
      const value = e.target.value;
      this.validateInputContents(value);
    }
  }

  handleInputChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      const value = e.target.value;
      this.setState({ displayValue: value });
    }
  }

  validateInputContents(value: string) {
    const date = parse(value.trim());

    if (!date || !isValid(date)) {
      this.setState({
        displayValue: '',
        value: null,
      });
      return;
    }

    const formattedDate = format(date, 'YYYY/MM/DD');
    this.setState({
      value: formattedDate,
      displayValue: formattedDate,
      day: getDate(date),
      month: getMonth(date) + 1,
      year: getYear(date),
    });

    this.props.onChange(formattedDate);
  }

  handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.setState({ isOpen: true });
    } else if (e.key === 'Enter') {
      if (e.target instanceof HTMLInputElement) {
        const value = e.target.value;
        this.validateInputContents(value);
      }
    }
  }

  handleCalendarKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.setState({ isOpen: false });
      // TODO: Set focus on the input again.
    }
  }

  handleCalendarBlur = () => {
    this.setState({ isOpen: false });
    this.validateInputContents(this.state.displayValue);
  }

  handleCalendarChange = ({ day, month, year }: EventChange) => {
    this.setState({ day, month, year });
  }

  handleCalendarSelect = ({ day, month, year, iso }: EventSelect) => {
    const value = iso.replace(/-/g, '/');
    this.setState({
      isOpen: false,
      value,
      displayValue: value,
      day,
      month,
      year,
    });
    this.props.onChange(iso);
  }

  render() {
    return (
      <DatePickerStateless
        isDisabled={this.props.isDisabled}
        isOpen={this.state.isOpen}
        value={this.state.value}
        displayValue={this.state.displayValue}

        onIconClick={this.handleIconClick}

        onInputBlur={this.handleInputBlur}
        onInputKeyDown={this.handleInputKeyDown}
        onInputChange={this.handleInputChange}

        onCalendarBlur={this.handleCalendarBlur}
        onCalendarChange={this.handleCalendarChange}
        onCalendarKeyDown={this.handleCalendarKeyDown}
        onCalendarSelect={this.handleCalendarSelect}

        day={this.state.day}
        month={this.state.month}
        year={this.state.year}

        disabled={this.props.disabled}
      />
    );
  }
}
