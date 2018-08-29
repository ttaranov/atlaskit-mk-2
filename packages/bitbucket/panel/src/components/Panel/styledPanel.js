// @flow
// import Button from '@atlaskit/button';
import { gridSize, typography } from '@atlaskit/theme';
import styled from 'styled-components';

export const PanelWrapper = styled.div`
  margin: 0 auto ${gridSize() * 2}px;
  width: 100%;
`;

export const PanelHeader = styled.div`
  ${typography.h400()};
  align-items: center;
  cursor: pointer;
  display: flex;
  margin-bottom: ${gridSize()}px;
  margin-top: ${gridSize() * 2}px;
  position: relative;
  text-align: left;
`;

export const ChevronIcon = styled.div`
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
  left: -${gridSize() * 3}px;
  position: absolute;
  transition: opacity 0.3s;

  ${PanelHeader}:hover & {
    opacity: 1;
  }
`;
