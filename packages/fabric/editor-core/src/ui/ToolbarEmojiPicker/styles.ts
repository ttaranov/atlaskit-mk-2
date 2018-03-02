// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const OuterContainer = styled.span`
  position: relative;
  margin-right: ${({ width }: { width: 'small' | 'large' }) =>
    !width || width === 'large' ? 0 : akGridSizeUnitless}px;
  > div {
    display: flex;
  }
`;
