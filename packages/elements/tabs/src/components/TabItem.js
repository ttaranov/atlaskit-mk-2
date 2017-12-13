// @flow

import React, { Component } from 'react';
import { NavItem, NavLine } from '../styled';
import type { TabItemComponentProvided } from '../types';

const noop = () => {};

const defaultElementProps = {
  'aria-posinset': 0,
  'aria-selected': false,
  'aria-setsize': 0,
  onClick: noop,
  onKeyDown: noop,
  onMouseDown: noop,
  role: 'tab',
  tabIndex: (() => -1)(), // Need to write it this way until extract-react-types-loader supports unary expressions
};

export default class TabItem extends Component<TabItemComponentProvided> {
  static defaultProps = {
    elementProps: defaultElementProps,
    elementRef: noop,
    data: { label: '' },
    isSelected: false,
  };

  render() {
    const { elementProps, elementRef, data, isSelected } = this.props;
    return (
      <NavItem
        {...elementProps}
        innerRef={elementRef}
        status={isSelected ? 'selected' : 'normal'}
      >
        {data.label}
        {isSelected ? <NavLine status="selected" /> : null}
      </NavItem>
    );
  }
}
