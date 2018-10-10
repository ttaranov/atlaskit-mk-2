// @flow
/* eslint-disable no-confusing-arrow */

import styled, { css } from 'styled-components';

import { gridSize, math } from '@atlaskit/theme';
import Button from '@atlaskit/button';

import { flagTextColor, flagFocusRingColor } from '../../theme';

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

export const StyledButton = styled(Button)`
  &,
  a& {
    font-weight: 500;
    padding: 0 ${p => (p.appearance === 'link' ? 0 : gridSize())}px !important;
    &:focus {
      box-shadow: 0 0 0 2px ${flagFocusRingColor};
    }
  }
`;
