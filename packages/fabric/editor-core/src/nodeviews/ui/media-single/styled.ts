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

function calcWidth(layout: MediaSingleLayout, fixedWidth: number = 0): string {
  switch (layout) {
    case 'wrap-right':
    case 'wrap-left':
      return 'calc(50% - 12px)';
    case 'wide':
      return `${Math.min(960, fixedWidth)}px`;
    case 'full-width':
      return `${fixedWidth}px`;
    default:
      return '100%';
  }
}

function calcMargin(layout: MediaSingleLayout): string {
  switch (layout) {
    case 'wrap-right':
      return '12px auto 24px 24px';
    case 'wrap-left':
      return '12px 24px 24px auto';
    default:
      return '24px auto';
  }
}

export interface WrapperProps {
  layout: MediaSingleLayout;
  width?: number;
  maxWidth: number;
  maxHeight: number;
}

const MediaSingleDimensionHelper = ({
  layout,
  width,
  maxWidth,
  maxHeight,
}: WrapperProps) => css`
  margin: ${calcMargin(layout)};
  float: ${float(layout)};
  max-width: ${maxWidth}px;
  max-height: ${maxHeight}px;
  width: ${calcWidth(layout, width)};
  &:after {
    content: '';
    display: block;
    padding-bottom: ${maxHeight / maxWidth * 100}%;
  }
`;

export const Wrapper = styled.div`
  ${MediaSingleDimensionHelper};
  position: relative;
  & > div {
    position: absolute;
    height: 100%;
  }
`;
Wrapper.displayName = 'WrapperMediaSingle';
