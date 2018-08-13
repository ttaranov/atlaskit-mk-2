// @flow
import { Component } from 'react';
import { type DragHandleProps } from 'react-beautiful-dnd';
import type { Props } from './TreeItem-types';
import { isSamePath } from '../../utils/path';
import { sameProps } from '../../utils/react';
import { type TreeDraggableProvided } from '../TreeItem/TreeItem-types';

export default class TreeItem extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      !sameProps(this.props, nextProps, ['item', 'provided', 'snapshot']) ||
      !isSamePath(this.props.path, nextProps.path)
    );
  }

  patchDragHandleProps = (
    dragHandleProps: ?DragHandleProps,
  ): ?DragHandleProps => {
    const { onDragAction } = this.props;
    if (dragHandleProps) {
      return {
        ...dragHandleProps,
        onMouseDown: (event: MouseEvent) => {
          onDragAction('mouse');
          if (dragHandleProps) {
            dragHandleProps.onMouseDown(event);
          }
        },
        onKeyDown: (event: KeyboardEvent) => {
          onDragAction('key');
          if (dragHandleProps) {
            dragHandleProps.onKeyDown(event);
          }
        },
        onTouchStart: (event: TouchEvent) => {
          onDragAction('touch');
          if (dragHandleProps) {
            dragHandleProps.onTouchStart(event);
          }
        },
      };
    }
    return null;
  };

  render() {
    const {
      item,
      path,
      onExpand,
      onCollapse,
      renderItem,
      provided,
      snapshot,
      itemRef,
    } = this.props;

    const innerRef = (el: ?HTMLElement) => {
      itemRef(item.id, el);
      provided.innerRef(el);
    };

    const finalProvided: TreeDraggableProvided = {
      ...provided,
      dragHandleProps: this.patchDragHandleProps(provided.dragHandleProps),
      innerRef,
    };

    return renderItem({
      item,
      depth: path.length - 1,
      onExpand: itemId => onExpand(itemId, path),
      onCollapse: itemId => onCollapse(itemId, path),
      provided: finalProvided,
      snapshot,
    });
  }
}
