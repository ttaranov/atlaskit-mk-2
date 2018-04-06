/* tslint:disable:variable-name */
import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { centerX } from '../../../styles';
import { center, borderRadius, size } from '@atlaskit/media-ui';
import {
  akGridSizeUnitless,
  akColorN20,
  akColorN30,
} from '@atlaskit/util-shared-styles';

const imgSize = 4 * akGridSizeUnitless;

export const RoundedBackground: ComponentClass<HTMLAttributes<{}>> = styled.div`
  ${centerX} ${borderRadius} min-width: ${imgSize}px;
  height: inherit;
  overflow: hidden;
`;

export const LoadingPlaceholder: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  ${center} ${size()} color: #cfd4db;
  background-color: ${akColorN20};
`;

export const EmptyPlaceholder: ComponentClass<HTMLAttributes<{}>> = styled.div`
  ${size(imgSize)} ${center} color: #cfd4db;
  background-color: ${akColorN30};
`;
