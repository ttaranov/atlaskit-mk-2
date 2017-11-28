/* tslint:disable:variable-name */
import styled from 'styled-components';
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
