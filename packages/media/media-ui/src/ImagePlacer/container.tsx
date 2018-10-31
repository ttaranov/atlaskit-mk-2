import * as React from 'react';

import { ContainerWrapper } from './styled';
import { Vector2 } from '../camera';

export const IS_TOUCH = typeof window.ontouchstart != 'undefined';

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
    if (IS_TOUCH) {
      document.addEventListener('touchmove', this.onTouchMove);
      document.addEventListener('touchend', this.onMouseUp);
      document.addEventListener('touchcancel', this.onMouseUp);
    } else {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
  }

  private getFirstTouch(e: any): Touch | null {
    if (e.touches && e.touches.length >= 1) {
      return e.touches[0];
    }
    return null;
  }

  onMouseDown = (e: any) => {
    if (e.which === 3) {
      return;
    }
    this.dragStart = new Vector2(e.clientX, e.clientY);
    this.props.onDragStart();
  };

  onTouchStart = (e: any) => {
    const touch = this.getFirstTouch(e);
    if (touch) {
      this.dragStart = new Vector2(touch.clientX, touch.clientY);
      this.props.onDragStart();
    }
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

  onTouchMove = (e: any) => {
    const { dragStart } = this;
    const touch = this.getFirstTouch(e);
    if (touch && dragStart) {
      const delta = new Vector2(
        touch.clientX - dragStart.x,
        touch.clientY - dragStart.y,
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
    const onMouseDown = IS_TOUCH ? undefined : this.onMouseDown;
    const onTouchStart = IS_TOUCH ? this.onTouchStart : undefined;

    return (
      <ContainerWrapper
        width={width}
        height={height}
        margin={margin}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onWheel={this.onWheel}
      >
        {children}
      </ContainerWrapper>
    );
  }
}
