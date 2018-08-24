// @flow
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
  text-transform: uppercase;
`;

export const ChevronIcon = styled.div`
  display: ${({ isHidden }) => (isHidden ? 'none' : 'block')};
  left: -${gridSize() * 3}px;
  position: absolute;

  ${PanelHeader}:hover & {
    display: block;
  }
`;
