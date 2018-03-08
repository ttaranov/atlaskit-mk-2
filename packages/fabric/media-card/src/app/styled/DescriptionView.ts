/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

const paddingSize = akGridSizeUnitless * 2;

export interface WrapperProps {
  contentMaxWidth: number;
}

export const Wrapper = styled.div`
  box-sizing: border-box;
  max-width: ${({ contentMaxWidth }: WrapperProps) => contentMaxWidth}px;
  padding: 0 ${paddingSize}px 12px ${paddingSize}px;
  line-height: ${akGridSizeUnitless * 2}px;
`;
