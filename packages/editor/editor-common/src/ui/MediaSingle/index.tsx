import * as React from 'react';
import { MediaSingleLayout, MediaSingleImageSize } from '../../schema';

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
  scale: MediaSingleImageScale;
  aspectRatio: number;
  containerWidth?: number;
  isLoading?: boolean;
  className?: string;
  updateScale?: (scale: MediaSingleImageScale) => void;
}

const fixedWidthPercentages: number[] = [0.5, 0.75, 1];
const fixedWidthPixels: number[] = fixedWidthPercentages.map(
  percentage => percentage * maxImageWidth,
);
const maxImageWidth: number = 680;

class MediaSingle extends React.Component<Props> {
  handleResizeStop = (
    event,
    direction,
    refToElement,
    delta: { width: number; height: number },
  ) => {
    // const sizeMap = {
    //   '50%': 0.5,
    //   '75%': 0.75,
    //   '100%': 1,
    // };
    // const currentRatio = sizeMap[this.props.size];
    // const scale = this.
    // const closestScale = fixedWidthPercentages
    //   .map(scale => ({scale, diff: Math.abs(imagePercentage -  scale)}))
    //   .reduce((prev, curr) => curr.diff < prev.diff ? curr : prev );
    // const newWidth = currentRatio * maxImageWidth + delta.width;
    // let newSize;
    // if (newWidth >= 680) {
    //   newSize = '100%';
    // } else if (newWidth > sizeMap['75%'] * maxImageWidth) {
    //   newSize = '75%';
    // } else if (newWidth > sizeMap['50%'] * maxImageWidth) {
    //   newSize = '50%';
    // }
    // console.log({ delta, currentRatio, newWidth, newSize });
    // this.props.updateScale(newSize);
    // if (delta.width > 300) {
    //   this.props.updateScale(this.props.size !== 10'5');
    // } else if(delta.width < -300) {
    //   this.props.updateScale(false);
    // }
  };

  mapSize = (size: { width: number; height: number }) => {
    console.log({ maxImageWidth });
    const imagePercentage: number = size.width / maxImageWidth;
    const maxImageHeight: number = size.height / imagePercentage;

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

    // return { width: 680 * newPercentage, height: size.height * scaling };
    // console.log("size is", size)
    // return size;
  };

  render() {
    const { children, aspectRatio, className, size } = this.props;
    const ratio = size === '50%' ? 0.5 : size === '75%' ? 0.75 : 1;
    return (
      <Resizable
        className={className}
        size={{
          width: 680 * ratio,
          height: 680 * ratio / aspectRatio,
        }}
        lockAspectRatio={aspectRatio}
        // grid={[gridSize, aspectRatio ? gridSize / aspectRatio : gridSize]}
        maxWidth="100%"
        // onResizeStop={this.handleResizeStop}
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
