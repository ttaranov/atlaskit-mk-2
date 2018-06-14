// @flow
import React, { Component } from 'react';
import type { Props } from './Tree-types';
import { noop } from '../utils/handy';
import { flattenTree } from '../utils/tree';
import type { FlattenedItem, FlattenedTree } from '../types';
import TreeItem from './TreeItem';

export default class Tree extends Component<Props> {
  static defaultProps = {
    tree: { children: [] },
    onExpand: noop,
    onCollapse: noop,
    onDragStart: noop,
    onDragEnd: noop,
    renderItem: noop,
  };

  render() {
    const { tree, renderItem, onExpand, onCollapse } = this.props;

    const items: FlattenedTree = flattenTree(tree);

    return items.map((flatItem: FlattenedItem) => (
      <TreeItem
        key={flatItem.item.id}
        item={flatItem.item}
        path={flatItem.path}
        onExpand={onExpand}
        onCollapse={onCollapse}
        renderItem={renderItem}
      />
    ));
  }
}
