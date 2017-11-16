// @flow

import { Calendar } from 'calendar-base';
import keycode from 'keycode';
import React, { Component } from 'react';
import { dateToString, getDayName, makeArrayFromNumber } from '../util';
import DateComponent from './Date';
import Heading from './Heading';
import {
  Announcer,
  CalendarTable,
  CalendarTbody,
  CalendarTh,
  CalendarThead,
  Wrapper,
} from '../styled/Calendar';

import type { EventChange } from '../types';

const arrowKeys = [
  keycode('down'),
  keycode('left'),
  keycode('right'),
  keycode('up'),
];
const daysPerWeek = 7;
const monthsPerYear = 12;

type Handler = (e: any) => void;
type Props = {
  /** Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates provided are greyed out.
   This does not prevent these dates being selected. */
  disabled: Array<string>,
  /** The number of the date currently focused. Places border around the date. 0 highlights no date. */
  focused: number,
  /** The number of the month (from 1 to 12) which the calendar should be on. */
  month: number,
  /** Function which is called when the calendar is no longer focused. */
  onBlur: Handler,
  /** Function which is called when navigation within the calendar is called,
  such as changing the month or year. Returns an object with day, month and
  year properties, each as a number. These will be the currently selected values
  with updates for if the change has been triggered internally by the forward and
  back arrows for months. */
  onChange: Handler,
  /** Function called when a day is clicked on. Calls with an object that has
  a day, month and week property as numbers, representing the date just clicked.
  It also has an 'iso' property, which is a string of the selected date in the
  format YYYY-MM-DD. */
  onSelect: Handler,
  /** Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates
   provided are given a background color. */
  previouslySelected: Array<string>,
  /** Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates
   provided are given a background color. */
  selected: Array<string>,
  /** Value of current day, as a string in the format 'YYYY-MM-DD'. */
  today: string,
  /** Year to display the calendar for. */
  year: number,
};

const now = new Date();
const nowDay = now.getDate();
const nowMonth = now.getMonth() + 1;
const nowYear = now.getFullYear();

export default class CalendarStateless extends Component<Props> {
  calendar: Object;
  props: Props;
  calendarEl: ?HTMLDivElement;

  static defaultProps = {
    disabled: [],
    focused: 0,
    month: nowMonth,
    onBlur() {},
    onChange() {},
    onSelect() {},
    previouslySelected: [],
    selected: [],
    today: dateToString({ day: nowDay, month: nowMonth, year: nowYear }),
    year: nowYear,
  };

  constructor(props: Props) {
    super(props);
    this.calendar = new Calendar({
      siblingMonths: true,
      weekNumbers: true,
    });
  }

  handleKeyDown = (e: KeyboardEvent) => {
    const { focused, month, year } = this.props;
    const key = e.keyCode;
    const isArrowKey = arrowKeys.indexOf(key) > -1;
    const isInitialArrowKeyPress = !focused && isArrowKey;

    e.preventDefault();
    if (isInitialArrowKeyPress) {
      this.triggerOnChange({ year, month, day: 1 });
      return;
    }

    // TODO break this down into separate functions.
    if (key === keycode('down')) {
      const next = focused + daysPerWeek;
      const daysInMonth = Calendar.daysInMonth(year, month - 1);

      if (next > daysInMonth) {
        const { month: nextMonth, year: nextYear } = this.nextMonth();
        this.triggerOnChange({
          year: nextYear,
          month: nextMonth,
          day: next - daysInMonth,
        });
      } else {
        this.triggerOnChange({ year, month, day: next });
      }
    } else if (key === keycode('left')) {
      const prev = focused - 1;

      if (prev < 1) {
        const { month: prevMonth, year: prevYear } = this.prevMonth();
        const prevDay = Calendar.daysInMonth(prevYear, prevMonth - 1);
        this.triggerOnChange({
          year: prevYear,
          month: prevMonth,
          day: prevDay,
        });
      } else {
        this.triggerOnChange({ year, month, day: prev });
      }
    } else if (key === keycode('right')) {
      const next = focused + 1;
      const daysInMonth = Calendar.daysInMonth(year, month - 1);

      if (next > daysInMonth) {
        const { month: nextMonth, year: nextYear } = this.nextMonth();
        this.triggerOnChange({ year: nextYear, month: nextMonth, day: 1 });
      } else {
        this.triggerOnChange({ year, month, day: next });
      }
    } else if (key === keycode('up')) {
      const prev = focused - daysPerWeek;

      if (prev < 1) {
        const { month: prevMonth, year: prevYear } = this.prevMonth();
        const prevDay = Calendar.daysInMonth(prevYear, prevMonth - 1) + prev;
        this.triggerOnChange({
          year: prevYear,
          month: prevMonth,
          day: prevDay,
        });
      } else {
        this.triggerOnChange({ year, month, day: prev });
      }
    } else if (key === keycode('enter') || key === keycode('space')) {
      const {
        focused: selectFocused,
        month: selectMonth,
        year: selectYear,
      } = this.props;
      this.triggerOnSelect({
        year: selectYear,
        month: selectMonth,
        day: selectFocused,
      });
    }
  };

  handleClickDay = ({ year, month, day }: EventChange) => {
    this.triggerOnSelect({ year, month, day });
  };

  handleClickNext = () => {
    const { focused: day, month, year } = {
      ...this.props,
      ...this.nextMonth(),
    };
    this.props.onChange({ day, month, year });
  };

  handleClickPrev = () => {
    const { focused: day, month, year } = {
      ...this.props,
      ...this.prevMonth(),
    };
    this.props.onChange({ day, month, year });
  };

  triggerOnChange = ({ year, month, day }: EventChange) => {
    const iso = dateToString({ year, month, day });
    this.props.onChange({ day, month, year, iso });
  };

  triggerOnSelect = ({ year, month, day }: EventChange) => {
    const iso = dateToString({ year, month, day });
    this.props.onSelect({ day, month, year, iso });
  };

  nextMonth() {
    let { month, year } = this.props;

    if (month === monthsPerYear) {
      month = 1;
      year += 1;
    } else {
      month += 1;
    }

    return { month, year };
  }

  prevMonth() {
    let { month, year } = this.props;

    if (month === 1) {
      month = monthsPerYear;
      year -= 1;
    } else {
      month -= 1;
    }

    return { month, year };
  }

  focus() {
    if (this.calendarEl instanceof HTMLDivElement) {
      this.calendarEl.focus();
    }
  }

  handleCalendarRef = (ref: ?HTMLDivElement) => {
    this.calendarEl = ref;
  };

  render() {
    const {
      disabled,
      focused,
      month,
      previouslySelected,
      selected,
      today,
      year,
    } = this.props;
    const calendar = this.calendar.getCalendar(year, month - 1);
    const weeks = [];
    const shouldDisplaySixthWeek = calendar.length % 6;

    if (shouldDisplaySixthWeek) {
      const lastDayIsSibling = calendar[calendar.length - 1].siblingMonth;
      const sliceStart = lastDayIsSibling ? daysPerWeek : 0;

      calendar.push(
        ...this.calendar
          .getCalendar(year, month)
          .slice(sliceStart, sliceStart + daysPerWeek)
          .map(e => ({ ...e, siblingMonth: true })),
      );
    }

    calendar.forEach(date => {
      const dateAsString = dateToString(date, { fixMonth: true });

      let week;
      if (date.weekDay === 0) {
        week = { key: dateAsString, components: [] };
        weeks.push(week);
      } else {
        week = weeks[weeks.length - 1];
      }

      const isDisabled = disabled.indexOf(dateAsString) > -1;
      const isFocused = focused === date.day && !date.siblingMonth;
      const isPreviouslySelected =
        previouslySelected.indexOf(dateAsString) > -1;
      const isSelected = selected.indexOf(dateAsString) > -1;
      const isSiblingMonth = date.siblingMonth;
      const isToday = today === dateAsString;

      week.components.push(
        <DateComponent
          disabled={isDisabled}
          focused={isFocused}
          isToday={isToday}
          key={dateAsString}
          month={date.month + 1}
          onClick={this.handleClickDay}
          previouslySelected={isPreviouslySelected}
          selected={isSelected}
          sibling={isSiblingMonth}
          year={date.year}
        >
          {date.day}
        </DateComponent>,
      );
    });

    return (
      // There's no interactive element to trap keyboard events on so we must trap them here so
      // that we can navigate the keyboard for them. The aria role of "grid" here will hint to
      // screen readers that it can be navigated with the keyboard, but the linter still fails.
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div onBlur={this.props.onBlur} onKeyDown={this.handleKeyDown}>
        <Announcer aria-live="assertive" aria-relevant="text">
          {new Date(year, month, focused).toString()}
        </Announcer>
        <Wrapper
          aria-label="calendar"
          role="grid"
          tabIndex={0}
          innerRef={this.handleCalendarRef}
        >
          <Heading
            month={month}
            year={year}
            handleClickNext={this.handleClickNext}
            handleClickPrev={this.handleClickPrev}
          />
          <CalendarTable role="presentation">
            <CalendarThead>
              <tr>
                {makeArrayFromNumber(daysPerWeek).map(i => (
                  <CalendarTh key={i}>{getDayName(i)}</CalendarTh>
                ))}
              </tr>
            </CalendarThead>
            <CalendarTbody style={{ border: 0 }}>
              {weeks.map(week => <tr key={week.key}>{week.components}</tr>)}
            </CalendarTbody>
          </CalendarTable>
        </Wrapper>
      </div>
    );
  }
}
