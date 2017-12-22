import styled, { css } from 'styled-components';
import { MediaSingleLayout } from '@atlaskit/editor-common';

function float(layout: MediaSingleLayout): string {
  switch (layout) {
    case 'wrap-right':
      return 'right';
    case 'wrap-left':
      return 'left';
    default:
      return 'none';
  }
}

function clear(layout: MediaSingleLayout): string {
  switch (layout) {
    case 'wrap-right':
      return 'right';
    case 'wrap-left':
      return 'left';
    default:
      return 'both';
  }
}

export interface WrapperProps {
  layout: MediaSingleLayout;
  width: number;
  height: number;
}

export const MediaSingleDimensionHelper = ({
  layout,
  width,
  height,
}: WrapperProps) => css`
  margin: 0 auto;
  float: ${float(layout)};
  clear: ${clear(layout)};
  max-width: ${width}px;
  max-height: ${height}px;
  width: 100%;
  &:after {
    content: '';
    display: block;
    padding-bottom: ${height / width * 100}%;
  }
`;

export const Wrapper = styled.div`
  ${MediaSingleDimensionHelper};
  position: relative;
  margin: 24px auto;
  & > div {
    position: absolute;
    height: 100%;
  }
`;
Wrapper.displayName = 'WrapperMediaSingle';
