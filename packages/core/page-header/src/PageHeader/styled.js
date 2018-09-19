// @flow

import styled, { css } from 'styled-components';
import { gridSize, typography } from '@atlaskit/theme';

const truncationStyles = css`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const getTruncation = ({ truncate }) => (truncate ? truncationStyles : null);

export const Outer = styled.div`
  margin: ${gridSize() * 3}px 0 0;
`;

export const StyledTitle = styled.h1`
  ${typography.h700()};
  ${getTruncation} line-height: ${gridSize() * 4}px;
  margin-top: 0;
`;

export const BreadcrumbsContainer = styled.div`
  margin-left: -${gridSize() / 2}px;
`;

export const TitleWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${gridSize() * 3}px;
`;

export const TitleContainer = styled.div`
  min-width: 0%;
  flex-shrink: 1;
  width: 100%;
`;

export const ActionsWrapper = styled.div`
  white-space: nowrap;
  padding-left: ${gridSize() * 4}px;
  min-width: 0%;
  flex-shrink: 0;
`;

export const BottomBarWrapper = styled.div`
  margin-bottom: ${gridSize() * 2}px;
`;
