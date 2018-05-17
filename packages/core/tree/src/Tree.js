// @flow
import React, { Component } from 'react';
import type { Props } from './Tree-types';
import { noop } from './utils/handy';

export default class Tree extends Component<Props> {
  static defaultProps = {
    tree: { children: [] },
    onExpand: noop,
    onCollapse: noop,
    onDragStart: noop,
    onDragEnd: noop,
    renderItem: noop,
    treeIndentation: 35,
  };

  render() {
    return null;
  }
}
