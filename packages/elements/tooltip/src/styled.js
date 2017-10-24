// @flow

import styled from 'styled-components';
import { borderRadius, colors, gridSize, math, themed } from '@atlaskit/theme';

const backgroundColor = themed({
  light: colors.N800,
  dark: colors.DN0,
});
const textColor = themed({
  light: colors.N0,
  dark: colors.DN600,
});

export const Tooltip = styled.span`
  background-color: ${backgroundColor};
  border-radius: ${borderRadius}px;
  box-sizing: border-box;
  color: ${textColor};
  display: inline-block;
  font-size: 12px;
  left: 0;
  line-height: 1.3;
  max-width: ${math.multiply(gridSize, 52)}px;
  padding: ${math.divide(gridSize, 4)}px ${gridSize}px;
  pointer-events: none;
  position: absolute;
  text-overflow: ellipsis;
  top: 0;
  white-space: nowrap;
`;

// The inline-block here is needed to keep the tooltip appearing in the correct position
// when nested inside a wider parent (see position: relative example).
export const Target = styled.div`
  display: inline-block;
`;
