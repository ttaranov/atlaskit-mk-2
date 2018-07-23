// @flow
import React, { type Node } from 'react';
import type { CoordinatesType, PositionType, PositionTypeBase } from '../types';
import getPosition from './utils/getPosition';

type Ref = (HTMLElement | void) => any;

type Props = {
  children: (Ref, string, Object) => Node,
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
  setRef = (ref: HTMLElement | void) => {
    this.setState({ ref });
  };
  render() {
    const { position, mouseCoordinates, mousePosition, target } = this.props;
    const { ref } = this.state;
    const adjustedPosition =
      target && ref
        ? getPosition({
            position,
            target,
            tooltip: ref,
            mouseCoordinates,
            mousePosition,
          })
        : {};
    return this.props.children(
      this.setRef,
      adjustedPosition.position || position,
      adjustedPosition.coordinates || {},
    );
  }
}

export default Position;
