/* tslint:disable:variable-name */

import styled from 'styled-components';

import { ComponentClass, AnchorHTMLAttributes } from 'react';

export interface AProps {
  underline: boolean;
}

export const A: ComponentClass<AnchorHTMLAttributes<{}>> = styled.a`
  text-decoration: none;
  outline: 0 !important;

  &:hover {
    text-decoration: none;
  }
  ${(props: AProps) =>
    props.underline
      ? `
    &:hover {
      text-decoration: underline;
    }
  `
      : ''};
`;
