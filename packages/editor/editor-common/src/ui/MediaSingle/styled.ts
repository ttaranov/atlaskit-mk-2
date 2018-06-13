import * as React from 'react';
import styled, { css } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { MediaSingleLayout } from '../../schema';
import {
  akEditorFullPageMaxWidth,
  akEditorWideLayoutWidth,
} from '../../styles';

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

function calcWidth(
  layout: MediaSingleLayout,
  width: number,
  containerWidth: number,
): string {
  // we need 4px space for the gap cursor
  const gapCursorSpace = 4;

  switch (layout) {
    case 'wrap-right':
    case 'wrap-left':
      return width > akEditorFullPageMaxWidth / 2
        ? 'calc(50% - 12px)'
        : `${width}px`;
    case 'wide':
      return `${Math.min(akEditorWideLayoutWidth, width)}px`;
    case 'full-width':
      return `${Math.min(width, containerWidth) - gapCursorSpace}px`;
    default:
      return width > akEditorFullPageMaxWidth ? '100%' : `${width}px`;
  }
}

function calcMargin(layout: MediaSingleLayout): string {
  switch (layout) {
    case 'wrap-right':
      return '12px auto 12px 24px';
    case 'wrap-left':
      return '12px 24px 12px auto';
    default:
      return '24px auto';
  }
}
export interface WrapperProps {
  layout: MediaSingleLayout;
  width: number;
  height: number;
  containerWidth: number;
}

const MediaSingleDimensionHelper = ({
  width,
  height,
  layout,
}: WrapperProps) => css`
  margin: ${calcMargin(layout)};
  &::after {
    content: '';
    display: block;
    padding-bottom: ${(height / width) * 100}%;
  }
`;

const Wrapper: React.ComponentClass<
  HTMLAttributes<{}> & WrapperProps
> = styled.div.attrs<{}>({
  style: ({ layout, width, containerWidth }) => ({
    width: calcWidth(layout, width, containerWidth),
    maxWidth:
      containerWidth < akEditorFullPageMaxWidth ? '100%' : containerWidth,
    float: float(layout),
  }),
})`
  ${MediaSingleDimensionHelper};
  position: relative;
  & > div {
    position: absolute;
    height: 100%;
  }
`;
Wrapper.displayName = 'WrapperMediaSingle';

export default Wrapper;
