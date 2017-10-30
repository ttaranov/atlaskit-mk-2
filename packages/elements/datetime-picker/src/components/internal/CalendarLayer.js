// @flow

import React, { Component, type Node, type ElementRef } from 'react';
import Layer from '@atlaskit/layer';
import { CalendarStateless as Calendar } from '@atlaskit/calendar';
import type { Handler } from '../../types';

type Props = {
  isOpen: boolean,

  onBlur: Handler,
  onChange: Handler,
  onKeyDown: Handler,
  onSelect: Handler,

  day: number,
  month?: number,
  year?: number,
  today?: string,
  selected: Array<string>,
  disabled: Array<string>,

  children: Node,
};

export default class CalendarLayer extends Component<Props> {
  props: Props;

  static defaultProps = {
    isOpen: false,

    onBlur() {},
    onChange() {},
    onKeyDown() {},
    onSelect() {},

    day: 0,
    month: undefined,
    year: undefined,
    today: undefined,
    selected: [],
    disabled: [],
  }

  handleCalendarRef = (ref: ?ElementRef<Calendar>) => {
    if (ref) {
      ref.focus();
    }
  }

  render() {
    const { isOpen, onBlur, onKeyDown, day, ...calendarProps } = this.props;

    const wrappedCalendar = (
      <div
        role="presentation"
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      >
        <Calendar
          focused={day}
          {...calendarProps}
          ref={this.handleCalendarRef}
        />
      </div>
    );

    return (
      <Layer
        content={isOpen ? wrappedCalendar : null}
        position="bottom left"
        offset="0 8px"
      >
        {this.props.children}
      </Layer>
    );
  }
}
