// @flow
/* eslint-disable no-confusing-arrow */

import styled, { css } from 'styled-components';

import { gridSize, fontSize, math } from '@atlaskit/theme';
import Button from '@atlaskit/button';

import {
  buttonBackgroundColor,
  buttonTextColor,
  flagTextColor,
  flagFocusRingColor,
} from '../../theme';

// Outputs the styles for actions separator: mid-dot for non-bold flags, or space for bold flags.
const getDivider = ({ hasDivider, useMidDot }) => css`
  display: ${hasDivider ? 'inline-block' : 'none'};
  content: "${useMidDot ? '\u00B7' : ''}";
  width: ${useMidDot ? math.multiply(gridSize, 2) : gridSize}px;
`;

export default styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: ${gridSize}px;
`;

export const Action = styled.div`
  &::before {
    color: ${flagTextColor};
    text-align: center;
    vertical-align: middle;

    ${getDivider};
  }
`;

const height = `${gridSize() * 3 / parseInt(fontSize(), 10)}em`;
export const StyledButton = styled(Button)`
  background: ${buttonBackgroundColor};
  color: ${buttonTextColor} !important;
  cursor: pointer;
  font-weight: 500;
  height: ${height} !important;
  line-height: ${height} !important;
  padding: 0 ${p => (p.appearance === 'normal' ? 0 : gridSize())}px;
  text-decoration: none;
  user-select: none;
  vertical-align: baseline;
  &:hover {
    text-decoration: underline;
  }

  &:focus {
    box-shadow: 0 0 0 2px ${flagFocusRingColor};
  }
`;
