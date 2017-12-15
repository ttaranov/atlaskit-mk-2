import styled, { css } from 'styled-components';
import { Layout } from '@atlaskit/editor-common';

function float(layout: Layout): string {
  switch (layout) {
    case 'wrap-right':
      return 'right';
    case 'wrap-left':
      return 'left';
    default:
      return 'none';
  }
}

function clear(layout: Layout): string {
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
  layout: Layout;
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
  display: flex;
  justify-content: center;
  margin: 24px auto;
  ${MediaSingleDimensionHelper};
  // Hack for selection outline
  & .media-wrapper {
    margin-left: -3px;
  }
`;
Wrapper.displayName = 'WrapperMediaSingle';
