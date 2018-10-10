import * as React from 'react';
import { MediaSingleLayout } from '../../schema';
import Wrapper from './styled';
import * as classnames from 'classnames';
import { calcPxFromPct, layoutSupportsWidth } from './grid';

export interface Props {
  children: React.ReactChild;
  layout: MediaSingleLayout;
  width: number;
  height: number;
  containerWidth?: number;
  isLoading?: boolean;
  className?: string;
  lineLength: number;
  pctWidth?: number;
}

export default function MediaSingle({
  children,
  layout,
  width,
  height,
  containerWidth = width,
  isLoading = false,
  pctWidth,
  lineLength,
  className,
}: Props) {
  const usePctWidth = pctWidth && layoutSupportsWidth(layout);
  if (pctWidth && usePctWidth) {
    const pxWidth = Math.ceil(
      calcPxFromPct(pctWidth / 100, lineLength || containerWidth),
    );

    // scale, keeping aspect ratio
    height = height / width * pxWidth;
    width = pxWidth;
  }

  return (
    <Wrapper
      layout={layout}
      width={width}
      height={height}
      containerWidth={containerWidth}
      pctWidth={pctWidth}
      className={classnames('media-single', layout, className, {
        'is-loading': isLoading,
        'media-wrapped': layout === 'wrap-left' || layout === 'wrap-right',
      })}
    >
      {React.Children.only(children)}
    </Wrapper>
  );
}
