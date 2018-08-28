// @flow
import React, { type Node } from 'react';
import type { CoordinatesType, PositionType, PositionTypeBase } from '../types';
import getPosition from './utils/getPosition';

type Ref = (HTMLElement | void) => any;

type Props = {
  children: (Ref, PositionType, Object) => Node,
  mouseCoordinates: CoordinatesType | null,
  mousePosition: PositionTypeBase,
  position: PositionType,
  target: HTMLElement | null,
};

type State = {
  ref: HTMLElement | null,
};

class Position extends React.Component<Props, State> {
  state = {
    ref: null,
  };
  initialMouseCoordinates: ?Object = undefined;
  setRef = (ref: HTMLElement | void) => {
    this.setState({ ref });
  };
  render() {
    const { position, mouseCoordinates, mousePosition, target } = this.props;
    const { ref } = this.state;
    let adjustedPosition = {};
    if (target && ref) {
      if (!this.initialMouseCoordinates) {
        // when we show the tooltip relative to the mouse position, always use
        // the initial mouse coordinates so the tooltip is placed in the same spot.
        this.initialMouseCoordinates = mouseCoordinates;
      }
      adjustedPosition = getPosition({
        position,
        target,
        tooltip: ref,
        mouseCoordinates: this.initialMouseCoordinates,
        mousePosition,
      });
    }
    return this.props.children(
      this.setRef,
      adjustedPosition.position || position,
      adjustedPosition.coordinates || {},
    );
  }
}

export default Position;
