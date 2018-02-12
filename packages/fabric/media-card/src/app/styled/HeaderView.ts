/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
import {
  akGridSizeUnitless,
  akColorN0,
  akColorN900,
} from '@atlaskit/util-shared-styles';
import { ellipsis } from '../../styles';

const largeMarginSize = akGridSizeUnitless * 2;

export interface WrapperProps {
  contentMaxWidth: number;
  hasSiblings: boolean;
}

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: ${({ contentMaxWidth }: WrapperProps) => contentMaxWidth}px;
  height: 18px;
  margin: ${largeMarginSize}px ${largeMarginSize}px
    ${({ hasSiblings }: WrapperProps) =>
      (hasSiblings && '12px') || `${largeMarginSize}px`}
    ${largeMarginSize}px;
`;

export const User = styled.div`
  display: flex;
  margin-right: ${largeMarginSize}px;
`;

export interface TitleProps {
  isInversed?: boolean;
}

export const Title = styled.div`
  flex: 1;
  color: ${({ isInversed }: TitleProps) =>
    isInversed ? akColorN0 : akColorN900};
  font-size: 14px;
  font-weight: 500;
  ${ellipsis()};
`;
