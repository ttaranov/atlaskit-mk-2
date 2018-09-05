import * as React from 'react';
import { MediaSingleLayout } from '../../schema';
import Wrapper from './styled';
import * as classnames from 'classnames';

export interface Props {
  children: React.ReactChild;
  layout: MediaSingleLayout;
  width: number;
  height: number;
  containerWidth?: number;
  isLoading?: boolean;
  className?: string;
  columns?: number;
}

export function calcMediaSingleWidth(
  columns: number,
  containerWidth: number,
): number {
  return (containerWidth > 680 ? 680 : containerWidth) / 12 * columns;
}

export default function MediaSingle({
  children,
  layout,
  width,
  height,
  containerWidth = width,
  isLoading = false,
  className,
  columns,
}: Props) {
  const mediaWidth = columns
    ? calcMediaSingleWidth(columns, containerWidth)
    : width;
  console.log('have media width', mediaWidth, 'with cols', columns);
  return (
    <Wrapper
      layout={layout}
      width={mediaWidth}
      height={columns ? height / (width / mediaWidth) : height}
      containerWidth={containerWidth}
      className={classnames('media-single', layout, className, {
        'is-loading': isLoading,
        'media-wrapped': layout === 'wrap-left' || layout === 'wrap-right',
      })}
    >
      {React.Children.only(children)}
    </Wrapper>
  );
}
