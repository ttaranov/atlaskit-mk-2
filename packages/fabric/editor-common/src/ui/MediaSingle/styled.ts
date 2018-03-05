// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass, css } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { MediaSingleLayout } from '../../schema';

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

function calcWidth(layout: MediaSingleLayout): string {
  switch (layout) {
    case 'wrap-right':
    case 'wrap-left':
      return 'calc(50% - 12px)';
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
  width: number;
  height: number;
}

const MediaSingleDimensionHelper = ({
  layout,
  width,
  height,
}: WrapperProps) => css`
  margin: ${calcMargin(layout)};
  float: ${float(layout)};
  max-width: ${width}px;
  max-height: ${height}px;
  width: ${calcWidth(layout)};
  &::after {
    content: '';
    display: block;
    padding-bottom: ${height / width * 100}%;
  }
`;

const Wrapper = styled.div`
  ${MediaSingleDimensionHelper};
  position: relative;
  & > div {
    position: absolute;
    height: 100%;
  }
`;
Wrapper.displayName = 'WrapperMediaSingle';

export default Wrapper;
