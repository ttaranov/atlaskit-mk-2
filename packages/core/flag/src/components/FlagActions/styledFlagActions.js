// @flow
/* eslint-disable no-confusing-arrow */

import styled, { css } from 'styled-components';

import { gridSize, fontSize, borderRadius, math } from '@atlaskit/theme';

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

// $FlowFixMe TEMPORARY
const height = `${gridSize * 3 / parseInt(fontSize, 10)}em`;
export const Button = styled.button`
  align-items: baseline;
  background: ${buttonBackgroundColor};
  border-radius: ${borderRadius}px;
  border-width: 0;
  box-sizing: border-box;
  color: ${buttonTextColor};
  cursor: pointer;
  display: inline-flex;
  font-size: inherit;
  font-style: normal;
  font-weight: 500;
  height: ${height};
  line-height: ${height};
  margin: 0;
  outline: 0;
  padding: 0
    ${p =>
      // $FlowFixMe TEMPORARY
      p.appearance === 'normal' ? 0 : gridSize(p)}px;
  text-align: center;
  text-decoration: none;
  user-select: none;
  vertical-align: baseline;
  white-space: nowrap;
  width: auto;

  &::-moz-focus-inner {
    border: 0;
    margin: 0;
    padding: 0;
  }

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${flagFocusRingColor};
  }
`;
