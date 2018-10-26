// @flow

import React, { Component } from 'react';
import { NavItem, NavLine } from '../styled';
import type { TabItemComponentProvided } from '../types';

const noop = () => {};

export default function TabItem (props) {
  static defaultProps = {
    data: {},
    elementProps: {},
    innerRef: noop,
    isSelected: false,
  };

  render() {
    const { data, elementProps, innerRef, isSelected } = this.props;
    return (
      <NavItem
        {...elementProps}
        innerRef={innerRef}
        status={isSelected ? 'selected' : 'normal'}
      >
        {data.label}
        {isSelected ? <NavLine status="selected" /> : null}
      </NavItem>
    );
  }
}
