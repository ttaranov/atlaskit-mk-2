/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes, AnchorHTMLAttributes } from 'react';

export const A = styled.a`
  text-decoration: none;
  outline: 0 !important;

  &:hover {
    text-decoration: none;
  }

  &.underline {
    &:hover {
      text-decoration: underline;
    }
  }
`;
