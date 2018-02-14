// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akBorderRadius } from '@atlaskit/util-shared-styles';
import {
  padding,
  Wrapper as WrapperDefault,
  PlaceholderFallback as PlaceholderFallbackDefault,
} from '../styles';

// tslint:disable-next-line:variable-name
export const Wrapper = styled(WrapperDefault)`
  cursor: pointer;
  display: inline-flex;

  > img {
    border-radius: ${akBorderRadius};
  }

  &::after,
  &::before {
    vertical-align: text-top;
    display: inline-block;
    width: 1px;
    content: '';
  }
`;

// tslint:disable-next-line:variable-name
export const PlaceholderFallback = styled(PlaceholderFallbackDefault)`
  padding: ${padding}px;
`;
