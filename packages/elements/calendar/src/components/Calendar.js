// @flow

import { Calendar as CalendarBase } from 'calendar-base';
import keycode from 'keycode';
import React, { Component } from 'react';
import withCtrl from 'react-ctrl';
import uuid from 'uuid/v1';
import { dateToString, getShortDayName, makeArrayFromNumber } from '../util';
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

type State = {
  disabled: Array<string>,
  focused: number,
  selected: Array<string>,
  month: number,
  previouslySelected: Array<string>,
  today: string,
  year: number,
};

class Calendar extends Component<Props, State> {
  calendar: Object;
  props: Props;
  calendarEl: ?HTMLDivElement;

  static defaultProps = {
    onBlur() {},
    onChange() {},
    onSelect() {},
    previouslySelected: [],
  };

  constructor(props: Props) {
    super(props);
    const now = new Date();
    const thisDay = now.getDate();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    this.state = {
      disabled: [],
      focused: 0,
      selected: [],
      month: thisMonth,
      previouslySelected: [],
      today: `${thisYear}-${thisMonth}-${thisDay}`,
      year: thisYear,
    };
    this.calendar = new CalendarBase({
      siblingMonths: true,
      weekNumbers: true,
    });
  }

  handleKeyDown = (e: KeyboardEvent) => {
    const { focused, month, year } = this.state;
    const key = e.keyCode;
    const isArrowKey = arrowKeys.indexOf(key) > -1;
    const isInitialArrowKeyPress = !focused && isArrowKey;

    e.preventDefault();
    if (isInitialArrowKeyPress) {
      this.triggerOnChange({ year, month, day: 1 });
      return;
    }

    if (key === keycode('enter') || key === keycode('space')) {
      const {
        focused: selectFocused,
        month: selectMonth,
        year: selectYear,
      } = this.state;
      this.triggerOnSelect({
        year: selectYear,
        month: selectMonth,
        day: selectFocused,
      });
    } else {
      this.navigate(keycode(key));
    }
  };

  handleClickDay = ({ year, month, day }: EventChange) => {
    this.triggerOnSelect({ year, month, day });
  };

  handleClickNext = () => {
    const { focused: day, month, year } = {
      ...this.state,
      ...this.nextMonth(),
    };
    this.triggerOnChange({ day, month, year });
  };

  handleClickPrev = () => {
    const { focused: day, month, year } = {
      ...this.state,
      ...this.prevMonth(),
    };
    this.triggerOnChange({ day, month, year });
  };

  focus() {
    if (this.calendar) {
      this.calendar.focus();
    }
  }

  getIsoString() {
    const { focused, month, year } = this.state;
    return `${year}-${month}-${focused}`;
  }

  navigate(dir) {
    const { focused, month, year } = this.state;

    if (dir === 'down') {
      const next = focused + daysPerWeek;
      const daysInMonth = CalendarBase.daysInMonth(year, month - 1);

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
    } else if (dir === 'left') {
      const prev = focused - 1;

      if (prev < 1) {
        const { month: prevMonth, year: prevYear } = this.prevMonth();
        const prevDay = CalendarBase.daysInMonth(prevYear, prevMonth - 1);
        this.triggerOnChange({
          year: prevYear,
          month: prevMonth,
          day: prevDay,
        });
      } else {
        this.triggerOnChange({ year, month, day: prev });
      }
    } else if (dir === 'right') {
      const next = focused + 1;
      const daysInMonth = CalendarBase.daysInMonth(year, month - 1);

      if (next > daysInMonth) {
        const { month: nextMonth, year: nextYear } = this.nextMonth();
        this.triggerOnChange({ year: nextYear, month: nextMonth, day: 1 });
      } else {
        this.triggerOnChange({ year, month, day: next });
      }
    } else if (dir === 'up') {
      const prev = focused - daysPerWeek;

      if (prev < 1) {
        const { month: prevMonth, year: prevYear } = this.prevMonth();
        const prevDay =
          CalendarBase.daysInMonth(prevYear, prevMonth - 1) + prev;
        this.triggerOnChange({
          year: prevYear,
          month: prevMonth,
          day: prevDay,
        });
      } else {
        this.triggerOnChange({ year, month, day: prev });
      }
    }
  }

  triggerOnChange = ({ year, month, day }: EventChange) => {
    const iso = dateToString({ year, month, day });
    this.props.onChange({ day, month, year, iso });
    this.setState({
      focused: day,
      month,
      year,
    });
  };

  triggerOnSelect = ({ year, month, day }: EventChange) => {
    const iso = dateToString({ year, month, day });
    this.props.onSelect({ day, month, year, iso });
  };

  nextMonth() {
    let { month, year } = this.state;

    if (month === monthsPerYear) {
      month = 1;
      year += 1;
    } else {
      month += 1;
    }

    return { month, year };
  }

  prevMonth() {
    let { month, year } = this.state;

    if (month === 1) {
      month = monthsPerYear;
      year -= 1;
    } else {
      month -= 1;
    }

    return { month, year };
  }

  handleCalendarRef = (ref: ?HTMLDivElement) => {
    this.calendarEl = ref;
  };

  getUniqueId = (prefix: string) => {
    return `${prefix}-${uuid()}`;
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
    } = this.state;
    const calendar = this.calendar.getCalendar(year, month - 1);
    const weeks = [];
    const shouldDisplaySixthWeek = calendar.length % 6;
    const announceId = this.getUniqueId('announce');

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
        <Announcer id={announceId} aria-live="assertive" aria-relevant="text">
          {new Date(year, month, focused).toString()}
        </Announcer>
        <Wrapper
          aria-label="calendar"
          role="grid"
          tabIndex={0}
          innerRef={this.handleCalendarRef}
          aria-describedby={announceId}
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
                  <CalendarTh key={i}>{getShortDayName(i)}</CalendarTh>
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

export default withCtrl(Calendar);
