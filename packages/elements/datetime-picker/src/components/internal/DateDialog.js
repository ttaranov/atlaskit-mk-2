// @flow

import React, { Component } from 'react';
import Layer from '@atlaskit/layer';
import {
  CalendarStateless as Calendar,
  type EventChange,
  type EventSelect,
} from '@atlaskit/calendar';
import type { Handler } from '../../types';
import { parseDate } from '../../util';

type Props = {
  value: string,
  isOpen: boolean,
  disabled: Array<string>,
  onBlur: Handler,
  onTriggerClose: Handler,
  onUpdate: (value: string) => void,
  children: Node,
};

type State = {
  day: number,
  month: number,
  year: number,
};

// TODO: Prevent selecting disabled dates.
export default class DateDialog extends Component<Props, State> {
  props: Props;
  calendar: any;

  static defaultProps = {
    isOpen: false,
    disabled: [],
    onTriggerClose() {},
    onUpdate() {},
  }

  constructor(props: Props) {
    super(props);

    this.setupCalendar();
  }

  componentDidUpdate(prevProps: Props) {
    // Focus the calendar when it is opened.
    // TODO: Add prop to toggle this behaviour.
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setupCalendar();
      this.calendar.focus();
    }
  }

  setupCalendar() {
    let date = new Date();
    if (this.props.value) {
      const parsedDate = parseDate(this.props.value);
      date = parsedDate ? parsedDate.date : date;
    }
    this.state = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  }

  handleChange = ({ day, month, year }: EventChange) => {
    this.setState({ day, month, year });
  }

  handleSelect = ({ iso }: EventSelect) => {
    // Don't allow selection of disabled dates.
    if (this.props.disabled.indexOf(iso) === -1) {
      this.props.onUpdate(iso);
    }
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.props.onTriggerClose();
    }
  }

  renderCalendar() {
    return (
      <div
        role="presentation"
        onBlur={this.props.onBlur}
        onKeyDown={this.handleKeyDown}
      >
        <Calendar
          focused={this.state.day}
          month={this.state.month}
          year={this.state.year}
          selected={this.props.value ? [this.props.value] : []}
          disabled={this.props.disabled}

          onChange={this.handleChange}
          onSelect={this.handleSelect}
          ref={ref => { this.calendar = ref; }}
        />
      </div>
    );
  }

  render() {
    return (
      <Layer
        content={this.props.isOpen ? this.renderCalendar() : null}
        position="bottom left"
        offset="0 8px"
      >
        {this.props.children}
      </Layer>
    );
  }
}
