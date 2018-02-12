/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
import {
  akColorN20,
  akColorN30,
  akColorB50,
} from '@atlaskit/util-shared-styles';
import { CardAppearance } from '../index';
import { Root, borderRadius, withAppearance } from '../styles';
import { getCSSBoundaries } from '../utils/cardDimensions';

export interface WrapperProps {
  appearance?: CardAppearance;
}

export const Wrapper = styled(Root)`
  ${borderRadius} ${({ appearance }: WrapperProps) =>
      getCSSBoundaries(appearance)} user-select: none;
  background-color: ${akColorN20};
  line-height: initial;
  padding: 0 8px 8px 8px;
  transition: background 0.3s;

  .link-wrapper:hover & {
    background-color: ${akColorN30};
  }

  .link-wrapper:active & {
    background-color: ${akColorB50};
  }

  ${withAppearance({
    square: `
      display: block;
      justify-content: flex-end;
    `,
    horizontal: `
      display: block;
    `,
  })};
`;
