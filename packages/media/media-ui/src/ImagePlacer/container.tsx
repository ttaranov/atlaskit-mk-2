import * as React from 'react';

import { ContainerWrapper } from './styled';
import { Vector2 } from '../camera';

export interface ContainerProps {
  width: number;
  height: number;
  margin: number;
  onDragStart: () => void;
  onDragMove: (delta: Vector2) => void;
  onWheel: (delta: number) => void;
}

export interface ContainerState {}

export class Container extends React.Component<ContainerProps, ContainerState> {
  dragStart?: Vector2;

  componentWillMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown = (e: any) => {
    this.dragStart = new Vector2(e.clientX, e.clientY);
    this.props.onDragStart();
  };

  onMouseMove = (e: any) => {
    const { dragStart } = this;
    if (dragStart) {
      const delta = new Vector2(
        e.clientX - dragStart.x,
        e.clientY - dragStart.y,
      );
      this.props.onDragMove(delta);
    }
  };

  onMouseUp = () => {
    delete this.dragStart;
  };

  onWheel = (e: any) => {
    this.props.onWheel(e.deltaY);
  };

  render() {
    const { width, height, children, margin } = this.props;

    return (
      <ContainerWrapper
        width={width}
        height={height}
        margin={margin}
        onMouseDown={this.onMouseDown}
        onWheel={this.onWheel}
      >
        {children}
      </ContainerWrapper>
    );
  }
}
