// @flow

import React, { Component } from 'react';
import Layer from '@atlaskit/layer';
import {
  CalendarStateless as Calendar,
  type EventChange,
  type EventSelect,
} from '@atlaskit/calendar';
import type { Handler } from '../../types';
// import dateToString from '../../util';

type Props = {
  isOpen: boolean,
  onTriggerClose: Handler,
  onUpdate: (iso: string) => void,

//   onBlur: Handler,
//   onChange: Handler,
//   onKeyDown: Handler,
//   onSelect: Handler,

//   day: number,
//   month?: number,
//   year?: number,
//   today?: string,
//   selected: Array<string>,
//   disabled: Array<string>,

  children: Node,
};

type State = {
  day: number,
  month: number,
  year: number,
};

export default class DateDialog extends Component<Props, State> {
  props: Props;
  calendar: any;

  static defaultProps = {
    isOpen: false,
    onTriggerClose() {},
    onUpdate() {},
  }

  constructor(props: Props) {
    super(props);

    const now = new Date();
    this.state = {
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  }

  componentDidUpdate(prevProps: Props) {
    // Focus the calendar when it is opened.
    // TODO: Add prop to toggle this behaviour.
    if (this.props.isOpen && !prevProps.isOpen) {
      console.log('auto-focusing calendar');
      this.calendar.focus();
    }
  }

  handleChange = ({ day, month, year }: EventChange) => {
    console.log('handleChange', day, month, year);
    this.setState({ day, month, year });
  }

  handleSelect = ({ iso }: EventSelect) => {
    this.props.onUpdate(iso);
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
        onKeyDown={this.handleKeyDown}
      >
        <Calendar
          focused={this.state.day}
          month={this.state.month}
          year={this.state.year}

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
