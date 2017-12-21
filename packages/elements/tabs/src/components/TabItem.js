// @flow

import React, { Component } from 'react';
import { NavItem, NavLine } from '../styled';
import type { TabItemComponentProvided } from '../types';

const noop = () => {};

export default class TabItem extends Component<TabItemComponentProvided> {
  static defaultProps = {
    'aria-posinset': 0,
    'aria-selected': false,
    'aria-setsize': 0,
    data: { label: '' },
    isSelected: false,
    onClick: noop,
    onKeyDown: noop,
    onMouseDown: noop,
    innerRef: noop,
    role: 'tab',
    tabIndex: (() => -1)(), // Need to write it this way until extract-react-types-loader supports unary expressions
  };

  render() {
    const { data, isSelected, ...elementProps } = this.props;
    return (
      <NavItem {...elementProps} status={isSelected ? 'selected' : 'normal'}>
        {data.label}
        {isSelected ? <NavLine status="selected" /> : null}
      </NavItem>
    );
  }
}
