/* tslint:disable:variable-name */

import styled, { css } from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import {
  akGridSizeUnitless,
  akColorN0,
  akColorN300,
} from '@atlaskit/util-shared-styles';

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  /* TODO: use mixin to vertically center items */
  display: flex;
  align-items: center;

  flex-grow: 1;
`;

export const IconWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  margin-right: ${akGridSizeUnitless}px;
`;

export interface TextProps {
  isInversed?: boolean;
}

const textStyles = css`
  color: ${({ isInversed }: TextProps) =>
    isInversed ? akColorN0 : akColorN300};
`;

export const Text: ComponentClass<HTMLAttributes<{}> & TextProps> = styled.span`
  ${textStyles};
`;
