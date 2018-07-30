import * as React from 'react';
import { MediaSingleLayout, MediaSingleImagePercentage } from '../../schema';

import * as BrokenImportResizable from '/Users/jcoppinger/repos/re-resizable';
import { default as ResizableType } from '/Users/jcoppinger/repos/re-resizable';

// import * as BrokenImportResizable from 're-resizable';
// import { default as ResizableType } from 're-resizable';

import styled from 'styled-components';
import { updateColumnsOnResize } from '../../../../editor-core/node_modules/@types/prosemirror-tables';

const Resizable = (BrokenImportResizable as any) as ResizableType;

export interface Props {
  children: React.ReactChild;
  layout: MediaSingleLayout;
  percentage: MediaSingleImagePercentage;
  aspectRatio: number;
  containerWidth?: number;
  isLoading?: boolean;
  className?: string;
  updatePercentage?: (percentage: MediaSingleImagePercentage) => void;
}

const fixedWidthPercentages: number[] = [0.5, 0.75, 1];
const maxImageWidth: number = 680;

class MediaSingle extends React.Component<Props> {
  resizer?: Resizable;

  handleResizeStop = (
    event,
    direction,
    refToElement,
    delta: { width: number; height: number },
  ) => {
    const oldImagePercentage = this.props.percentage;
    const currentImageSize =
      oldImagePercentage * maxImageWidth + delta.width * 2;
    const imagePercentage = currentImageSize / maxImageWidth;

    const closestPercentage: {
      percentage: number;
      diff: number;
    } = fixedWidthPercentages
      .map(percentage => ({
        percentage,
        diff: Math.abs(imagePercentage - percentage),
      }))
      .reduce((prev, curr) => (curr.diff < prev.diff ? curr : prev));

    if (this.props.updatePercentage) {
      this.props.updatePercentage(
        closestPercentage.percentage as MediaSingleImagePercentage,
      );
    }
  };

  mapPercentage = (percentage: number) => {
    const closestPercentage: {
      p: number;
      diff: number;
    } = fixedWidthPercentages
      .map(p => ({
        p,
        diff: Math.abs(percentage - p),
      }))
      .reduce((prev, curr) => (curr.diff < prev.diff ? curr : prev));

    console.log(closestPercentage);

    // return percentage;
    return (
      percentage * closestPercentage.diff +
      closestPercentage.p * (1 - closestPercentage.diff)
    );

    // return closestPercentage.diff < 0.05 ? closestPercentage.p : percentage;
  };

  mapSize = (size: { width: number; height: number }) => {
    console.log({ maxImageWidth });
    const imagePercentage: number = size.width / maxImageWidth;
    const newPercentage = this.mapPercentage(imagePercentage);
    const maxImageHeight: number = size.height / imagePercentage;

    return {
      width: maxImageWidth * newPercentage,
      height: maxImageHeight * newPercentage,
    };
  };

  handleResize = (
    event: MouseEvent | TouchEvent,
    direction: ResizableDirection,
    refToElement: HTMLDivElement,
    delta: NumberSize,
  ) => {
    const size = {
      width: this.resizer.state.original.width,
      height: this.resizer.state.original.height,
    };
    console.log('current size:', size);
    const newSize = {
      width: size.width + delta.width * 2,
      height: size.height + delta.height * 2,
    };
    this.resizer.setState({
      width: Math.min(Math.max(newSize.width, 0), maxImageWidth),
      height: Math.min(
        Math.max(newSize.height, 0),
        maxImageWidth / this.props.aspectRatio,
      ),
    });
  };

  handleRef = element => {
    this.resizer = element || undefined;
  };

  render() {
    const { children, aspectRatio, className, percentage } = this.props;
    return (
      <Resizable
        className={className}
        size={{
          width: maxImageWidth * percentage,
          height: maxImageWidth * percentage / aspectRatio,
        }}
        lockAspectRatio={aspectRatio}
        maxWidth="100%"
        onResizeStop={this.handleResizeStop}
        mapSize={this.mapSize}
        onResize={this.handleResize}
        ref={this.handleRef}
      >
        {React.Children.only(children)}
      </Resizable>
    );
  }
}

export default styled(MediaSingle)`
  margin: 0 auto;

  & > div {
    position: absolute;
    height: 100%;
  }
`;
