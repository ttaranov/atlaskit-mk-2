import { HTMLAttributes } from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import { getCSSUnitValue } from '../../utils/getCSSUnitValue';

export interface WrapperProps {
  width: string | number;
  height?: number;
}

const getHeightAttribute = ({ height }: WrapperProps) => {
  return typeof height !== 'undefined'
    ? `height: ${getCSSUnitValue(height)};`
    : '';
};

export const Wrapper: StyledComponentClass<
  HTMLAttributes<{}> & WrapperProps,
  {}
> = styled.div`
  display: inline-block;

  overflow-x: hidden;
  overflow-y: auto;
  -ms-overflow-style: scrollbar;

  width: ${({ width }: WrapperProps) => getCSSUnitValue(width)};
  ${getHeightAttribute};
`;
