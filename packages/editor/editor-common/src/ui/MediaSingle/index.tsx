import * as React from 'react';
import { MediaSingleLayout } from '../../schema';
import Wrapper from './styled';
import * as classnames from 'classnames';
import { EditorAppearance } from 'src/types';
import { snapToGrid } from './grid';

export interface Props {
  children: React.ReactChild;
  layout: MediaSingleLayout;
  width: number;
  height: number;
  containerWidth?: number;
  isLoading?: boolean;
  className?: string;
  appearance: EditorAppearance;
  gridWidth?: number;
  gridSize?: number;
}

export default function MediaSingle({
  children,
  layout,
  width,
  height,
  containerWidth = width,
  isLoading = false,
  gridWidth,
  gridSize,
  appearance,
  className,
}: Props) {
  if (gridWidth) {
    const { width: snappedWidth, height: snappedHeight } = snapToGrid(
      gridWidth,
      width,
      height,
      gridSize,
      containerWidth,
      appearance,
    );
    width = snappedWidth;
    height = snappedHeight;
  }

  return (
    <Wrapper
      layout={layout}
      width={width}
      height={height}
      containerWidth={containerWidth}
      forceWidth={!!gridWidth}
      className={classnames('media-single', layout, className, {
        'is-loading': isLoading,
        'media-wrapped': layout === 'wrap-left' || layout === 'wrap-right',
      })}
    >
      {React.Children.only(children)}
    </Wrapper>
  );
}
