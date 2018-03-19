// @flow

import { Calendar as CalendarBase } from 'calendar-base';
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

import type { ChangeEvent, SelectEvent, DateObj, ArrowKeys } from '../types';

const arrowKeys = {
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
};
const daysPerWeek = 7;
const monthsPerYear = 12;

type Handler = (e: any) => void;
type Props = {
  /** The number of the day currently focused. Places border around the date. 0 highlights no date. */
  day: number,
  /** Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates provided are greyed out.
   This does not prevent these dates being selected. */
  disabled: Array<string>,
  /** Props to apply to the container. **/
  innerProps: Object,
  /** A reference to the Calendar instance itself to get access to the focus and navigate instance methods. */
  innerRef: (ref: ?Component<*>) => void,
  /** The number of the month (from 1 to 12) which the calendar should be on. */
  month: number,
  /** Function which is called when the calendar is no longer focused. */
  onBlur: Handler,
  /** Called when the calendar is navigated. This can be triggered by the keyboard, or by clicking the navigational buttons.
   The 'type' property indicates the the direction the calendar was navigated whereas the 'iso' property is a string of the format YYYY-MM-DD. */
  onChange: ChangeEvent => void,
  /** Called when the calendar receives focus. This could be from a mouse event on the container by tabbing into it. */
  onFocus: Handler,
  /** Function called when a day is clicked on. Calls with an object that has
  a day, month and week property as numbers, representing the date just clicked.
  It also has an 'iso' property, which is a string of the selected date in the
  format YYYY-MM-DD. */
  onSelect: SelectEvent => void,
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
  day: number,
  disabled: Array<string>,
  selected: Array<string>,
  month: number,
  previouslySelected: Array<string>,
  today: string,
  year: number,
};

function getUniqueId(prefix: string) {
  return `${prefix}-${uuid()}`;
}

class Calendar extends Component<Props, State> {
  calendar: Object;
  container: HTMLElement | null;

  static defaultProps = {
    onBlur() {},
    onChange() {},
    onFocus() {},
    onSelect() {},
  };

  constructor(props: Props) {
    super(props);
    const now = new Date();
    const thisDay = now.getDate();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    this.state = {
      day: 0,
      disabled: [],
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

  getNextMonth() {
    let { month, year } = this.state;

    if (month === monthsPerYear) {
      month = 1;
      year += 1;
    } else {
      month += 1;
    }

    return { month, year };
  }

  getPrevMonth() {
    let { month, year } = this.state;

    if (month === 1) {
      month = monthsPerYear;
      year -= 1;
    } else {
      month -= 1;
    }

    return { month, year };
  }

  componentDidMount() {
    const { innerRef } = this.props;

    if (typeof innerRef === 'function') {
      innerRef(this);
    }
  }

  componentWillUnmount() {
    const { innerRef } = this.props;

    if (typeof innerRef === 'function') {
      innerRef(null);
    }
  }

  handleContainerKeyDown = (e: KeyboardEvent) => {
    const { key } = e;
    const arrowKey = arrowKeys[key];

    if (key === 'Enter' || key === ' ') {
      const {
        day: selectDay,
        month: selectMonth,
        year: selectYear,
      } = this.state;
      e.preventDefault();
      this.triggerOnSelect({
        day: selectDay,
        year: selectYear,
        month: selectMonth,
      });
    } else if (arrowKey) {
      e.preventDefault();
      this.navigate(arrowKey);
    }
  };

  handleClickDay = ({ year, month, day }: DateObj) => {
    this.triggerOnSelect({ year, month, day });
  };

  handleClickNext = () => {
    const { day, month, year } = {
      ...this.state,
      ...this.getNextMonth(),
    };
    this.triggerOnChange({ day, month, year, type: 'next' });
  };

  handleClickPrev = () => {
    const { day, month, year } = {
      ...this.state,
      ...this.getPrevMonth(),
    };
    this.triggerOnChange({ day, month, year, type: 'prev' });
  };

  handleContainerBlur = () => {
    this.setState({ day: 0 });
    this.props.onBlur();
  };

  handleContainerFocus = () => {
    this.setState({ day: this.state.day || 1 });
    this.props.onFocus();
  };

  focus() {
    if (this.container) {
      this.container.focus();
    }
  }

  navigate(type: ArrowKeys) {
    const { day, month, year } = this.state;

    if (type === 'down') {
      const next = day + daysPerWeek;
      const daysInMonth = CalendarBase.daysInMonth(year, month - 1);

      if (next > daysInMonth) {
        const { month: nextMonth, year: nextYear } = this.getNextMonth();
        this.triggerOnChange({
          year: nextYear,
          month: nextMonth,
          day: next - daysInMonth,
          type,
        });
      } else {
        this.triggerOnChange({ year, month, day: next, type });
      }
    } else if (type === 'left') {
      const prev = day - 1;

      if (prev < 1) {
        const { month: prevMonth, year: prevYear } = this.getPrevMonth();
        const prevDay = CalendarBase.daysInMonth(prevYear, prevMonth - 1);
        this.triggerOnChange({
          year: prevYear,
          month: prevMonth,
          day: prevDay,
          type,
        });
      } else {
        this.triggerOnChange({ year, month, day: prev, type });
      }
    } else if (type === 'right') {
      const next = day + 1;
      const daysInMonth = CalendarBase.daysInMonth(year, month - 1);

      if (next > daysInMonth) {
        const { month: nextMonth, year: nextYear } = this.getNextMonth();
        this.triggerOnChange({
          year: nextYear,
          month: nextMonth,
          day: 1,
          type,
        });
      } else {
        this.triggerOnChange({ year, month, day: next, type });
      }
    } else if (type === 'up') {
      const prev = day - daysPerWeek;

      if (prev < 1) {
        const { month: prevMonth, year: prevYear } = this.getPrevMonth();
        const prevDay =
          CalendarBase.daysInMonth(prevYear, prevMonth - 1) + prev;
        this.triggerOnChange({
          year: prevYear,
          month: prevMonth,
          day: prevDay,
          type,
        });
      } else {
        this.triggerOnChange({ year, month, day: prev, type });
      }
    }
  }

  refContainer = (e: HTMLElement | null) => {
    this.container = e;
  };

  triggerOnChange = ({
    year,
    month,
    day,
    type,
  }: $Diff<ChangeEvent, { iso: string }>) => {
    const iso = dateToString({ year, month, day });
    this.props.onChange({ day, month, year, iso, type });
    this.setState({
      day,
      month,
      year,
    });
  };

  triggerOnSelect = ({
    year,
    month,
    day,
  }: $Diff<SelectEvent, { iso: string }>) => {
    const iso = dateToString({ year, month, day });
    this.props.onSelect({ day, month, year, iso });
    this.setState({
      selected: [iso],
    });
  };

  render() {
    const { innerProps } = this.props;
    const {
      day,
      disabled,
      month,
      previouslySelected,
      selected,
      today,
      year,
    } = this.state;
    const calendar = this.calendar.getCalendar(year, month - 1);
    const weeks = [];
    const shouldDisplaySixthWeek = calendar.length % 6;
    const announceId = getUniqueId('announce');

    // Some months jump between 5 and 6 weeks to display. In some cases 4 (Feb
    // with the 1st on a Monday etc). This ensures the UI doesn't jump around by
    // catering to always showing 6 weeks.
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
      const isFocused = day === date.day && !date.siblingMonth;
      const isPreviouslySelected =
        !isDisabled && previouslySelected.indexOf(dateAsString) > -1;
      const isSelected = !isDisabled && selected.indexOf(dateAsString) > -1;
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
      <div
        {...innerProps}
        onBlur={this.handleContainerBlur}
        onFocus={this.handleContainerFocus}
        onKeyDown={this.handleContainerKeyDown}
        role="presentation"
      >
        <Announcer id={announceId} aria-live="assertive" aria-relevant="text">
          {new Date(year, month, day).toString()}
        </Announcer>
        <Wrapper
          aria-describedby={announceId}
          aria-label="calendar"
          innerRef={this.refContainer}
          role="grid"
          tabIndex={0}
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
