// @flow

import styled, { css } from 'styled-components';
import { borderRadius, colors, themed } from '@atlaskit/theme';

const backgroundColor = themed({
  light: colors.N800,
  dark: colors.DN0,
});
const textColor = themed({
  light: colors.N0,
  dark: colors.DN600,
});

const common = css`
  background-color: ${backgroundColor};
  border-radius: ${borderRadius}px;
  box-sizing: border-box;
  color: ${textColor};
  font-size: 12px;
  left: 0;
  line-height: 1.3;
  max-width: 240px;
  padding: 2px 6px;
  pointer-events: none;
  position: fixed;
  top: 0;
  z-index: 1000;
`;

export const Tooltip = styled.div`
  ${common};
`;
export const TruncatedTooltip = styled.div`
  ${common} max-width: 420px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// The inline-block here is needed to keep the tooltip appearing in the correct position
// when nested inside a wider parent (see position: relative example).
export const Target = styled.div`
  display: inline-block;
`;
