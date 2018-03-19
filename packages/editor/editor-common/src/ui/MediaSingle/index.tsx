import * as React from 'react';
import { ReactElement } from 'react';
import { MediaSingleLayout } from '../../schema';
import Wrapper from './styled';

export interface Props {
  children: ReactElement<any>;
  layout: MediaSingleLayout;
  width: number;
  height: number;
  containerWidth?: number;
}

export default function MediaSingle({
  children,
  layout,
  width,
  height,
  containerWidth = width,
}: Props) {
  return (
    <Wrapper
      layout={layout}
      width={width}
      height={height}
      containerWidth={containerWidth}
    >
      {React.Children.only(children)}
    </Wrapper>
  );
}
