/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass, css } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import {
  akGridSizeUnitless,
  akColorN0,
  akColorN300,
} from '@atlaskit/util-shared-styles';

export const Wrapper = styled.div`
  /* TODO: use mixin to vertically center items */
  display: flex;
  align-items: center;

  flex-grow: 1;
`;

export const IconWrapper = styled.div`
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

export const Text = styled.span`
  ${textStyles};
`;
