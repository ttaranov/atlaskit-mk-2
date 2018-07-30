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
// const fixedWidthPixels: number[] = fixedWidthPercentages.map(
//   percentage => percentage * maxImageWidth,
// );
const maxImageWidth: number = 680;

class MediaSingle extends React.Component<Props> {
  handleResizeStop = (
    event,
    direction,
    refToElement,
    delta: { width: number; height: number },
  ) => {
    const oldImagePercentage = this.props.percentage;
    const currentImageSize = oldImagePercentage * maxImageWidth + delta.width;
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

    console.log({ delta, imagePercentage, closestPercentage });

    if (this.props.updatePercentage) {
      console.log('setting percentage to ', closestPercentage.percentage);
      this.props.updatePercentage(
        closestPercentage.percentage as MediaSingleImagePercentage,
      );
    }
  };

  mapSize = (size: { width: number; height: number }) => {
    console.log({ maxImageWidth });
    const imagePercentage: number = size.width / maxImageWidth;
    const maxImageHeight: number = size.height / imagePercentage;

    // maxImageWidth * ratio / aspectRatio

    const closestPercentage: {
      percentage: number;
      diff: number;
    } = fixedWidthPercentages
      .map(percentage => ({
        percentage,
        diff: Math.abs(imagePercentage - percentage),
      }))
      .reduce((prev, curr) => (curr.diff < prev.diff ? curr : prev));

    console.log(closestPercentage);

    const newPercentage: number =
      closestPercentage.diff < 0.05
        ? closestPercentage.percentage
        : imagePercentage;

    const newSize = {
      width: maxImageWidth * newPercentage,
      height: maxImageHeight * newPercentage,
    };
    return newSize;
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
        // grid={[gridSize, aspectRatio ? gridSize / aspectRatio : gridSize]}
        maxWidth="100%"
        onResizeStop={this.handleResizeStop}
        mapSize={this.mapSize}
        // onResizeStop={this.handleResizeStop}
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
