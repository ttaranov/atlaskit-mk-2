/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
import { center, centerX, borderRadius, size } from '../../../styles';
import {
  akGridSizeUnitless,
  akColorN20,
  akColorN30,
} from '@atlaskit/util-shared-styles';

const imgSize = 4 * akGridSizeUnitless;

export const RoundedBackground = styled.div`
  ${centerX} ${borderRadius} min-width: ${imgSize}px;
  height: inherit;
  overflow: hidden;
`;

export const LoadingPlaceholder = styled.div`
  ${center} ${size()} color: #cfd4db;
  background-color: ${akColorN20};
`;

export const EmptyPlaceholder = styled.div`
  ${size(imgSize)} ${center} color: #cfd4db;
  background-color: ${akColorN30};
`;
