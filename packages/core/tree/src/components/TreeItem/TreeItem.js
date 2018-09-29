// @flow
import { Component } from 'react';
import type {
  DraggableProps,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { isSamePath } from '../../utils/path';
import { sameProps } from '../../utils/react';
import type {
  Props,
  TreeDraggableProvided,
  TreeDraggableProps,
} from './TreeItem-types';

export default class TreeItem extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      !sameProps(this.props, nextProps, ['item', 'provided', 'snapshot']) ||
      !isSamePath(this.props.path, nextProps.path)
    );
  }

  patchDraggableProps = (
    draggableProps: DraggableProps,
    snapshot: DraggableStateSnapshot,
  ): TreeDraggableProps => {
    const { path, offsetPerLevel } = this.props;

    const transitions =
      draggableProps.style && draggableProps.style.transition
        ? [draggableProps.style.transition]
        : [];
    if (snapshot.dropAnimation) {
      transitions.push(
        `padding-left ${snapshot.dropAnimation.duration}s ${
          snapshot.dropAnimation.curve
        }`,
      );
    }
    const transition = transitions.join(', ');

    //$FlowFixMe
    return {
      ...draggableProps,
      style: {
        ...draggableProps.style,
        paddingLeft: (path.length - 1) * offsetPerLevel,
        transition,
      },
    };
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
      draggableProps: this.patchDraggableProps(
        provided.draggableProps,
        snapshot,
      ),
      dragHandleProps: provided.dragHandleProps,
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
