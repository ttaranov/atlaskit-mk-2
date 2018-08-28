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
}

export default function MediaFallback({
  children,
  layout,
  width,
  height,
  containerWidth = width,
  isLoading = false,
  className,
}: Props) {
  return (
    <Wrapper
      layout={layout}
      width={width}
      height={height}
      containerWidth={containerWidth}
      className={classnames('media-single', layout, className, {
        'is-loading': isLoading,
        'media-wrapped': layout === 'wrap-left' || layout === 'wrap-right',
      })}
    >
      <h1>Media Fallback</h1>
      {React.Children.only(children)}
    </Wrapper>
  );
}
