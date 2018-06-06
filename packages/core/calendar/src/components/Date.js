// @flow

import React, { Component } from 'react';
import { DateDiv, DateTd } from '../styled/Date';

type Props = {
  children: number,
  disabled?: boolean,
  focused?: boolean,
  isToday?: boolean,
  month: number,
  onClick?: Function,
  previouslySelected?: boolean,
  selected?: boolean,
  sibling?: boolean,
  year: number,
};

type State = {
  isActive: boolean,
};

export default class extends Component<Props, State> {
  props: Props;
  static defaultProps = {
    disabled: false,
    focused: false,
    isToday: false,
    onClick() {},
    previouslySelected: false,
    selected: false,
    sibling: false,
    today: '',
  };
  state = {
    isActive: false,
  };
  onMouseDown = (e: MouseEvent) => {
    // Prevent mousedown triggering an ancestor onBlur event in IE11 resulting
    // in dates not being selectable.
    e.preventDefault();
    this.setState({ isActive: true });
  };
  onMouseUp = () => {
    this.setState({ isActive: false });
  };
  onClick = () => {
    const { children: day, month, onClick, year, disabled } = this.props;
    if (!disabled && onClick) {
      onClick({ year, month, day });
    }
  };
  render() {
    const {
      children,
      disabled,
      focused,
      isToday,
      previouslySelected,
      selected,
      sibling,
    } = this.props;
    return (
      <DateTd
        aria-selected={selected ? 'true' : 'false'}
        role="gridcell"
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      >
        <DateDiv
          disabled={disabled}
          focused={focused}
          isToday={isToday}
          previouslySelected={previouslySelected}
          selected={selected}
          sibling={sibling}
          isActive={this.state.isActive}
        >
          {children}
        </DateDiv>
      </DateTd>
    );
  }
}
