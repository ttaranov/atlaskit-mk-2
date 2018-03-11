import * as React from 'react';
import { ReactElement } from 'react';
import { MediaSingleLayout } from '../../schema';
import Wrapper from './styled';

export interface Props {
  children: ReactElement<any>;
  height: number;
  layout: MediaSingleLayout;
  width: number;
}

export default function MediaSingle({
  children,
  height,
  layout,
  width,
}: Props) {
  return (
    <Wrapper layout={layout} height={height} width={width}>
      {React.Children.only(children)}
    </Wrapper>
  );
}
