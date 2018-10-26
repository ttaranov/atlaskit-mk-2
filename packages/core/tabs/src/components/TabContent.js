// @flow

import React, { Component } from 'react';
import { TabPane } from '../styled';
import type { TabContentComponentProvided } from '../types';

export default function TabContent (props) {
  static defaultProps = {
    data: {},
    elementProps: {},
  };
  render() {
    const { data, elementProps } = this.props;
    return <TabPane {...elementProps}>{data.content}</TabPane>;
  }
}
