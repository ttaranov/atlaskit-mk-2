import * as React from 'react';
import styled, { css } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { MediaSingleLayout } from '../../schema';
import {
  akEditorFullPageMaxWidth,
  akEditorWideLayoutWidth,
  akEditorBreakoutPadding,
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
  containerWidth?: number,
): string {
  switch (layout) {
    case 'wrap-right':
    case 'wrap-left':
      return width > akEditorFullPageMaxWidth / 2
        ? 'calc(50% - 12px)'
        : `${width}px`;
    case 'wide':
      return `${Math.min(akEditorWideLayoutWidth, width)}px`;
    case 'full-width':
      return `${Math.min(width, containerWidth || 0) -
        akEditorBreakoutPadding}px`;
    default:
      return width > akEditorFullPageMaxWidth ? '100%' : `${width}px`;
  }
}

function calcMaxWidth(
  layout: MediaSingleLayout,
  width: number,
  containerWidth: number,
) {
  switch (layout) {
    case 'wide':
    case 'full-width':
      return containerWidth < akEditorFullPageMaxWidth
        ? '100%'
        : `${containerWidth}px`;
    default:
      return '100%';
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
  containerWidth?: number;
  pctWidth?: number;
  innerRef?: (elem: HTMLElement) => void;
}

/**
 * Can't use `.attrs` to handle highly dynamic styles because we are still
 * supporting `styled-components` v1.
 */
export const MediaSingleDimensionHelper = ({
  width,
  height,
  layout,
  containerWidth = 0,
  pctWidth,
}: WrapperProps) => css`
  width: ${pctWidth ? `${width}px` : calcWidth(layout, width, containerWidth)};
  max-width: ${calcMaxWidth(layout, width, containerWidth)};
  float: ${float(layout)};
  margin: ${calcMargin(layout)};

  tr & {
    max-width: 100%;
  }
`;

const Wrapper: React.ComponentClass<
  HTMLAttributes<{}> & WrapperProps
> = styled.div`
  ${MediaSingleDimensionHelper};
  position: relative;

  &::after {
    content: '';
    display: block;
    padding-bottom: ${p => p.height / p.width * 100}%;
  }

  & > div {
    position: absolute;
    height: 100%;
  }
`;
Wrapper.displayName = 'WrapperMediaSingle';

export default Wrapper;
