// @flow
import { Component } from 'react';
import type { Props } from './TreeItem-types';
import { isSamePath } from '../utils/tree';

export default class TreeItem extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    if (
      ['item', 'provided', 'snapshot'].find(p => this.props[p] !== nextProps[p])
    ) {
      return true;
    }
    return !isSamePath(this.props.path, nextProps.path);
  }

  render() {
    const {
      item,
      path,
      onExpand,
      onCollapse,
      renderItem,
      provided,
      snapshot,
    } = this.props;

    return renderItem({
      item,
      depth: path.length - 1,
      onExpand: itemId => onExpand(itemId, path),
      onCollapse: itemId => onCollapse(itemId, path),
      provided,
      snapshot,
    });
  }
}
