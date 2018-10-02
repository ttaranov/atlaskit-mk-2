import * as React from 'react';
import * as classnames from 'classnames';
import { MediaSingleLayout } from '@atlaskit/editor-common';
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

const snapTo = (target: number, points: number[]): number =>
  points.reduce(
    (prev, cur) =>
      Math.abs(cur - target) < Math.abs(prev - target) ? cur : prev,
  );

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
      this.props.displayGrid(true, gridTypeForLayout(this.props.layout));
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
      this.props.displayGrid(true, gridTypeForLayout(newSize.layout));
    }

    this.resizable.updateSize({ width: newWidth, height: 'auto' });
  };

  handleResizeStop = (
    event,
    direction,
    refToElement,
    delta: { width: number; height: number },
  ) => {
    this.setState({ isResizing: false }, () => {
      this.props.displayGrid(false, gridTypeForLayout(this.props.layout));
    });

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

    const snapWidth = snapTo(newWidth, this.props.snapPoints);
    const newSize = this.props.calcNewSize(snapWidth, true);
    this.props.updateSize(newSize.width, newSize.layout);
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
