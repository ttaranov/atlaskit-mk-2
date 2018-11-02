import * as React from 'react';
import * as classnames from 'classnames';
import { MediaSingleLayout, calcColumnsFromPx } from '@atlaskit/editor-common';
import { Props, EnabledHandles } from './types';

// @ts-ignore
// tslint:disable-next-line
const Resizable = require('re-resizable');
import {
  default as ResizableType,
  ResizableDirection,
  NumberSize,
} from 're-resizable';

import { gridTypeForLayout } from '../../../grid';

export const handleSides = ['left', 'right'];

const snapGravityPx = 48;
const snapTo = (
  target: number,
  points: number[],
  scaleFactor: number = 1,
): number =>
  points.reduce((point, closest) => {
    return Math.abs(closest - target) - snapGravityPx * scaleFactor <
      Math.abs(point - target)
      ? closest
      : point;
  });

export default class Resizer extends React.Component<
  Props & {
    selected: boolean;
    enable: EnabledHandles;
    calcNewSize: (
      newWidth: number,
      stop: boolean,
    ) => { layout: MediaSingleLayout; width: number | null };
    snapPoints: number[];
    scaleFactor?: number;
    getColumnLeft: () => number;
    isInlineLike: boolean;
  },
  {
    isResizing: boolean;
  }
> {
  resizable: ResizableType;
  state = {
    isResizing: false,
  };

  handleResizeStart = () => {
    this.setState({ isResizing: true }, () => {
      this.props.displayGrid(
        true,
        gridTypeForLayout(this.props.layout),
        this.highlights(this.props.width),
      );
    });
  };

  handleResize = (
    event: MouseEvent | TouchEvent,
    direction: ResizableDirection,
    elementRef: HTMLDivElement,
    delta: NumberSize,
  ) => {
    if (!this.resizable || !this.resizable.state.original) {
      return;
    }

    const newWidth = Math.max(
      this.resizable.state.original.width +
        delta.width * (this.props.scaleFactor || 1),
      this.props.snapPoints[0],
    );

    const newSize = this.props.calcNewSize(newWidth, false);
    if (newSize.layout !== this.props.layout) {
      this.props.updateSize(newSize.width, newSize.layout);
    }

    this.props.displayGrid(
      true,
      gridTypeForLayout(newSize.layout),
      this.highlights(newWidth),
    );
    this.resizable.updateSize({ width: newWidth, height: 'auto' });
  };

  highlights = newWidth => {
    const snapWidth = snapTo(
      newWidth,
      this.props.snapPoints,
      this.props.scaleFactor,
    );
    const columnWidth = Math.round(
      calcColumnsFromPx(snapWidth, this.props.lineLength, this.props.gridSize),
    );

    const highlight: number[] = [];
    if (this.props.layout === 'wrap-left') {
      highlight.push(0);
      highlight.push(columnWidth);
    } else if (this.props.layout === 'wrap-right') {
      highlight.push(this.props.gridSize);
      highlight.push(this.props.gridSize - columnWidth);
    } else if (this.props.isInlineLike) {
      highlight.push(this.props.getColumnLeft() + columnWidth);
    } else {
      highlight.push(Math.round(this.props.gridSize / 2 - columnWidth / 2));
      highlight.push(Math.round(this.props.gridSize / 2 + columnWidth / 2));
    }

    return highlight;
  };

  handleResizeStop = (
    event,
    direction,
    refToElement,
    delta: { width: number; height: number },
  ) => {
    if (!this.resizable) {
      return;
    }

    if (!this.resizable.state.original) {
      return;
    }

    const newWidth = Math.max(
      this.resizable.state.original.width + delta.width,
      this.props.snapPoints[0],
    );

    const snapWidth = snapTo(
      newWidth,
      this.props.snapPoints,
      this.props.scaleFactor,
    );
    const newSize = this.props.calcNewSize(snapWidth, true);

    // show committed grid size
    this.props.displayGrid(
      true,
      gridTypeForLayout(newSize.layout),
      this.highlights(newWidth),
    );

    this.setState({ isResizing: false }, () => {
      this.props.updateSize(newSize.width, newSize.layout);
      this.props.displayGrid(false, gridTypeForLayout(this.props.layout));
    });
  };

  setResizableRef = ref => {
    this.resizable = ref;
  };

  render() {
    const handleStyles = {};
    const handles = {};
    handleSides.forEach(side => {
      handles[side] = `mediaSingle-resize-handle-${side}`;
      handleStyles[side] = {
        width: '24px',
        [side]: '-13px',
        zIndex: 99,
      };
    });

    // Ideally, Resizable would let you pass in the component rather than
    // the div. For now, we just apply the same styles using CSS
    return (
      // @ts-ignore
      <Resizable
        ref={this.setResizableRef}
        onResize={this.handleResize}
        size={{
          width: this.props.width || 0,
        }}
        className={classnames(
          'media-single',
          this.props.layout,
          this.props.className,
          {
            'is-loading': this.props.isLoading,
            'is-resizing': this.state.isResizing,
            'mediaSingle-selected': this.props.selected,
            'media-wrapped':
              this.props.layout === 'wrap-left' ||
              this.props.layout === 'wrap-right',
          },
        )}
        handleWrapperClass={'mediaSingle-resize-wrapper'}
        handleClasses={handles}
        handleStyles={handleStyles}
        enable={this.props.enable}
        onResizeStop={this.handleResizeStop}
        onResizeStart={this.handleResizeStart}
      >
        {this.props.children}
      </Resizable>
    );
  }
}
