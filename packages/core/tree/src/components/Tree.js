// @flow
import { Component } from 'react';
import type { Props } from './Tree-types';
import { noop } from '../utils/handy';
import { flattenTree } from '../utils/tree';
import type { FlattenedItem, FlattenedTree } from '../types';

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
    const { tree, renderItem } = this.props;

    const items: FlattenedTree = flattenTree(tree);

    return items.map((item: FlattenedItem) => {
      return renderItem({
        item: item.item,
        depth: item.path.length - 1,
        isDragging: false,
      });
    });
  }
}
