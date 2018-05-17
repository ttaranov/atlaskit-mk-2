// @flow
import { Component } from 'react';
import type { Props } from './Tree-types';
import { noop } from '../utils/handy';
import { flattenTree } from '../utils/tree';
import type { FlattenItem, FlattenTree } from '../types';

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

    const items: FlattenTree = flattenTree(tree);

    return items.map((item: FlattenItem) => {
      return renderItem({
        item: item.item,
        level: item.path.length - 1,
        isDragged: false,
        isHovered: false,
      });
    });
  }
}
