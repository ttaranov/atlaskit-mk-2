import * as React from 'react';
import { MediaSingleLayout } from '../../schema';
import Wrapper from './styled';
import * as classnames from 'classnames';
import { calcPxFromPct, snapToGrid } from './grid';
import { ContainerConsumer } from '../ContainerProvider';

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
  return (
    <ContainerConsumer>
      {value => {
        if (pctWidth) {
          const ll = value ? value.clientWidth : lineLength;
          const pxWidth = Math.ceil(calcPxFromPct(pctWidth / 100, ll));

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
              'media-wrapped':
                layout === 'wrap-left' || layout === 'wrap-right',
            })}
          >
            {React.Children.only(children)}
          </Wrapper>
        );
      }}
    </ContainerConsumer>
  );
}
