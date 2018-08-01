import * as React from 'react';
import { MediaSingleLayout, MediaSingleSize } from '../../schema';
import * as Resizable from 're-resizable';
import { NumberSize, ResizableDirection } from 're-resizable';
import styled from 'styled-components';
import * as BezierEasing from 'bezier-easing';

export interface Props {
  children: React.ReactChild;
  layout: MediaSingleLayout;
  size: MediaSingleSize;
  aspectRatio: number;
  containerWidth?: number;
  isLoading?: boolean;
  className?: string;
  updateSize?: (size: string) => void;
}
type State = {
  isResizing: boolean;
};

const sizeMap = {
  '50%': 0.5,
  '75%': 0.75,
  '100%': 1,
};

const clamp = ({ width, height }) => {
  const adjustedWidth =
    Math.floor(width / 170) * 170 + easeFn((width % 170) / 170) * 170;
  return {
    width: adjustedWidth,
    height: height / width * adjustedWidth,
  };
};

const easeFn = new BezierEasing(1, 0, 0, 1);

class MediaResizer extends React.Component {
  resizer?: Resizable;

  handleRef = element => {
    this.resizer = element || undefined;
  };

  handleResize = (
    event: MouseEvent | TouchEvent,
    direction: ResizableDirection,
    elementRef: HTMLDivElement,
    delta: NumberSize,
  ) => {
    if (this.resizer && this.resizer.state.original) {
      const { width, height } = this.resizer.state.original!;
      const factor = this.props.enable.left && this.props.enable.right ? 2 : 1;
      const newWidth = Math.max(
        Math.min(width + delta.width * factor, 680),
        340,
      );
      const newHeight = Math.max(
        Math.min(height + delta.height * factor, height / width * 680),
        height / width * 340,
      );
      this.resizer.updateSize({ width: newWidth, height: newHeight });
    }
  };

  render() {
    return (
      <Resizable
        {...this.props}
        ref={this.handleRef}
        onResize={this.handleResize}
      >
        {this.props.children}
      </Resizable>
    );
  }
}

class MediaSingle extends React.Component<Props, State> {
  handleResizeStart = () => {
    this.setState({ isResizing: true });
  };
  handleResizeStop = (
    event,
    direction,
    refToElement,
    delta: { width: number; height: number },
  ) => {
    const currentRatio = sizeMap[this.props.size];
    const pageWidth = 680;
    const newWidth = currentRatio * pageWidth + delta.width;

    let newSize;
    if (newWidth >= 680) {
      newSize = '100%';
    } else if (
      newWidth > sizeMap['75%'] * pageWidth - 50 &&
      newWidth < sizeMap['75%'] * pageWidth + 50
    ) {
      newSize = '75%';
    } else if (newWidth < sizeMap['50%'] * pageWidth + 50) {
      newSize = '50%';
    }

    if (newSize) {
      this.props.updateSize(newSize);
    }
    this.setState({ isResizing: false });
  };

  render() {
    const { children, aspectRatio, className, size } = this.props;
    const ratio = size === '50%' ? 0.5 : size === '75%' ? 0.75 : 1;
    const GridLines = styled(({ className }) => (
      <div className={className}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    ))`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      pointer-events: none;
      & > div {
        box-sizing: border-box;
        border-left: 1px solid gray;
        border-right: 1px solid gray;
        height: 100%;
        display: inline-block
        width: 12.5%
      }
    `;
    return (
      <div style={{ position: 'relative' }}>
        <MediaResizer
          className={className}
          size={{
            width: 680 * ratio,
            height: 680 * ratio / aspectRatio,
          }}
          lockAspectRatio={aspectRatio}
          enable={{
            left:
              this.props.layout === 'center' ||
              this.props.layout === 'wrap-right',
            right:
              this.props.layout === 'center' ||
              this.props.layout === 'wrap-left',
          }}
          onResizeStop={this.handleResizeStop}
        >
          {React.Children.only(children)}
        </MediaResizer>
        {<GridLines />}
      </div>
    );
  }
}

export default styled(MediaSingle)`
  margin: ${props =>
    props.layout === 'center'
      ? '0 auto'
      : props.layout === 'wrap-left'
        ? '0 auto 0 0'
        : '0 0 0 auto'};
  position: relative;

  & > div {
    position: absolute;
    height: 100%;
  }

  & > .grid {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    & > .line {
      display: inline-block;
      border-left: 1px solid black;
      border-right: 1px solid black;
    }
  }
`;
