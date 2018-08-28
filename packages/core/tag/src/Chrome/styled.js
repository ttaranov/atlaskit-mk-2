// @flow
import styled from 'styled-components';
import { colors, themed, gridSize, borderRadius } from '@atlaskit/theme';
import { buttonWidthUnitless, tagHeight, focusRingColor } from '../constants';
import { backgroundColorHover, textColorHover } from '../theme';

const gridSizeUnitless = gridSize();

const colorRemoval = themed('appearance', {
  removal: { light: colors.R500, dark: colors.DN30 },
});
const colorRemovalHover = themed('appearance', {
  removalHover: { light: colors.N700, dark: colors.DN30 },
});
const backgroundColorRemoval = themed('appearance', {
  removallight: { light: colors.R50, dark: colors.R100 },
});

export const Span = styled.span`
  &:focus {
    box-shadow: 0 0 0 2px ${focusRingColor};
    outline: none;
  }

  border-radius: ${({ isRounded }) =>
    isRounded ? `${buttonWidthUnitless / 2}px` : `${borderRadius()}px`};
  cursor: default;
  display: flex;
  height: ${tagHeight};
  line-height: 1;
  margin: ${gridSizeUnitless / 2}px;
  padding: 0;
  overflow: ${({ isRemoved, isRemoving }) =>
    isRemoved || isRemoving ? 'hidden' : 'initial'};
  ${p => `
    background-color: ${
      p.markedForRemoval ? backgroundColorRemoval(p) : p.backgroundColor
    };
    color: ${p.markedForRemoval ? colorRemoval(p) : p.textColor};
  `};
  &:hover {
    box-shadow: none;
    background-color: ${p =>
      p.markedForRemoval ? backgroundColorRemoval(p) : backgroundColorHover(p)};
    color: ${p =>
      p.markedForRemoval ? colorRemovalHover(p) : textColorHover(p)};
  }
`;
