/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, LiHTMLAttributes } from 'react';
import { akColorN500, akColorB400 } from '@atlaskit/util-shared-styles';

export interface WrapperProps {
  isActive: boolean;
}

export const Wrapper = styled.li`
  color: ${({ isActive }: WrapperProps) =>
    isActive ? akColorB400 : akColorN500};
  padding: 6px 25px;
  list-style-type: none;
  opacity: 1;

  ${({ isActive }: WrapperProps) => (isActive ? '' : 'cursor: pointer')};
  &:hover {
    ${({ isActive }: WrapperProps) =>
      isActive ? '' : 'background-color: #E5E8EC'};
  }
`;

export const ServiceIcon = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

export const ServiceName = styled.div`
  font-size: 14px;
  position: relative;
  margin-left: 10px;
  top: -1px;
  display: inline-block;
`;
