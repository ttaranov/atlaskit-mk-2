// @flow

import styled from 'styled-components';
import {
  akTypographyMixins,
  akGridSizeUnitless,
} from '@atlaskit/util-shared-styles';

export const Outer = styled.div`
  margin: ${akGridSizeUnitless * 3}px 0 0;
`;

export const Title = styled.h1`
  ${akTypographyMixins.h700};
  line-height: ${akGridSizeUnitless * 4}px;
  margin-top: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const BreadcrumbsContainer = styled.div`
  margin-left: -${akGridSizeUnitless / 2}px;
`;

export const TitleWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${akGridSizeUnitless * 3}px;
`;

export const CustomComponentWrapper = styled.div`
  min-width: 0%;
  flex-shrink: 1;
  width: 100%;
`;

export const ActionsWrapper = styled.div`
  white-space: nowrap;
  padding-left: ${akGridSizeUnitless * 4}px;
  min-width: 0%;
  flex-shrink: 0;
`;

export const BottomBarWrapper = styled.div`
  margin-bottom: ${akGridSizeUnitless * 2}px;
`;
