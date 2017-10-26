// @flow
import React, { Component } from 'react';
import Container from './internal/Container';
import Input from './internal/Input';
import CalendarLayer from './internal/CalendarLayer';
import type { Handler } from '../types';

type Props = {
  isDisabled: boolean,
  isOpen: boolean,
  value: ?string,
  displayValue: ?string,

  onIconClick: Handler,

  onInputBlur: Handler,
  onInputChange: Handler,
  onInputKeyDown: Handler,

  onCalendarBlur: Handler,
  onCalendarChange: Handler,
  onCalendarKeyDown: Handler,
  onCalendarSelect: Handler,

  day: number,
  month?: number,
  year?: number,
  today?: string,
  disabled: Array<string>,
};

export default class DatePickerStateless extends Component<Props> {
  props: Props;
  input: any;

  static defaultProps = {
    isDisabled: false,
    isOpen: false,
    value: null,
    displayValue: '',

    onIconClick() {},

    onInputBlur() {},
    onInputKeyDown() {},
    onInputChange() {},

    onCalendarBlur() {},
    onCalendarChange() {},
    onCalendarKeyDown() {},
    onCalendarSelect() {},

    day: 0,
    month: undefined,
    year: undefined,
    today: undefined,
    disabled: [],
  }

  selectInput() {
    this.input.select();
  }

  render() {
    const {
      isDisabled,
      isOpen,
      value,
      displayValue,
      onIconClick,
      onInputBlur,
      onInputChange,
      onInputKeyDown,
      onCalendarBlur,
      onCalendarChange,
      onCalendarKeyDown,
      onCalendarSelect,
      day,
      month,
      year,
      today,
      disabled,
    } = this.props;
    const selected = value ? [value] : [];

    return (
      <CalendarLayer
        isOpen={isOpen}
        onBlur={onCalendarBlur}
        onChange={onCalendarChange}
        onKeyDown={onCalendarKeyDown}
        onSelect={onCalendarSelect}
        day={day}
        month={month}
        year={year}
        today={today}
        selected={selected}
        disabled={disabled}
      >
        <Container
          shouldShowIcon
          isDisabled={isDisabled}
          onIconClick={onIconClick}
        >
          <Input
            value={displayValue}
            isDisabled={isDisabled}
            placeholder="yyyy/mm/dd"
            onBlur={onInputBlur}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
            ref={ref => { this.input = ref; }}
          />
        </Container>
      </CalendarLayer>
    );
  }
}
