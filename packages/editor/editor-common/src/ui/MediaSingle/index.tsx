import * as React from 'react';
import { MediaSingleLayout } from '../../schema';
import * as Resizable from 're-resizable';
import styled from 'styled-components';

export interface Props {
  children: React.ReactChild;
  layout: MediaSingleLayout;
  width: number;
  height: number;
  containerWidth?: number;
  isLoading?: boolean;
  className?: string;
}

const StyledResizable = styled(Resizable)`
  margin: 0 auto;

  & > div {
    position: absolute;
    height: 100%;
  }
`;

export default function MediaSingle({
  children,
  layout,
  width,
  height,
  containerWidth = width,
  isLoading = false,
  className,
}: Props) {
  const aspectRatio = width / height;
  return (
    <StyledResizable
      size={{ width: width || '100%', height: height || '100%' }}
      lockAspectRatio={aspectRatio}
      minWidth="25%"
      maxWidth="100%"
    >
      {React.Children.only(children)}
    </StyledResizable>
  );
}
