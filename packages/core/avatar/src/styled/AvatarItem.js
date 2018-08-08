// @flow
import React from 'react';
import styled, { css } from 'styled-components';
import { css as emotionCSS } from 'emotion';
import { borderRadius, colors, gridSize, math, themed } from '@atlaskit/theme';
import type { AvatarClickType } from '../types';

const activeBackgroundColor = themed({
  light: colors.B50,
  dark: colors.DN40,
});
const hoverBackgroundColor = themed({
  light: colors.N30,
  dark: colors.DN50,
});
const focusBorderColor = themed({
  light: colors.B200,
  dark: colors.B75,
});

type getBackgroundColorType = {
  backgroundColor?: string,
  href?: string,
  isActive?: boolean,
  isHover?: boolean,
  isSelected?: boolean,
  onClick?: AvatarClickType,
};

export function getBackgroundColor({
  backgroundColor,
  href,
  isActive,
  isHover,
  isSelected,
  onClick,
  ...props
}: getBackgroundColorType) {
  const isInteractive = href || onClick;

  let themedBackgroundColor = backgroundColor || colors.background(props);

  // Interaction: Hover
  if (isInteractive && (isHover || isSelected)) {
    themedBackgroundColor = hoverBackgroundColor(props);
  }

  // Interaction: Active
  if (isInteractive && isActive) {
    themedBackgroundColor = activeBackgroundColor(props);
  }

  return themedBackgroundColor;
}

type getStylesType = {|
  href?: string,
  isActive?: boolean,
  isDisabled?: boolean,
  isFocus?: boolean,
  onClick?: AvatarClickType,
|};

export function getStyles({
  href,
  isActive,
  isDisabled,
  isFocus,
  onClick,
  ...props
}: getStylesType) {
  const isInteractive = href || onClick;

  let borderColor = 'transparent';
  let cursor = 'auto';
  let opacity = 1;
  let outline = 'none';
  let pointerEvents = 'auto';

  // Interaction: Focus
  if (isInteractive && isFocus && !isActive) {
    outline = 'none';
    borderColor = focusBorderColor(props);
  }

  // Disabled
  if (isDisabled) {
    cursor = 'not-allowed';
    opacity = 0.75;
    pointerEvents = 'none';
  }

  // Interactive
  if (isInteractive) {
    cursor = 'pointer';
  }
  return {
    alignItems: 'center;',
    backgroundColor: `${getBackgroundColor(props)};`,
    borderRadius: `${borderRadius(props)}px;`,
    border: `2px solid ${borderColor};`,
    boxSizing: 'content-box;',
    color: 'inherit;',
    cursor: `${cursor};`,
    display: 'flex;',
    fontSize: 'inherit;',
    fontStyle: 'normal;',
    fontWeight: 'normal;',
    lineHeight: '1;',
    opacity: `${opacity};`,
    outline: `${outline};`,
    borderImage: 'initial',
    margin: 0,
    padding: ` ${math.divide(gridSize, 2)(props)}px;`,
    pointerEvents: `${pointerEvents};`,
    textAlign: `left;`,
    textDecoration: `none;`,
    width: '100%',
  };
}

const truncateTextCSS = props => {
  console.log(props);
  return (
    props.truncate && {
      overflowX: 'hidden;',
      textOverflow: 'ellipsis;',
      whiteSpace: 'nowrap;',
    }
  );
};

const truncateTextFlexParentCSS = props =>
  props.truncate && {
    maxWidth: '100%;',
    minWidth: '0;',
  };

export const Content = props => (
  <div
    className={emotionCSS({
      ...truncateTextFlexParentCSS(props),
      flex: '1 1 100%;',
      lineHeight: '1.4;',
      paddingLeft: `${gridSize()}px;`,
    })}
    {...props}
  />
);

export const scContent = styled.div`
  ${truncateTextFlexParentCSS} flex: 1 1 100%;
  line-height: 1.4;
  padding-left: ${gridSize}px;
`;

export const PrimaryText = props => (
  <div
    className={emotionCSS({
      ...truncateTextCSS(props),
      color: `${colors.text(props)};`,
    })}
    {...props}
  />
);
export const scPrimaryText = styled.div`
  ${truncateTextCSS} color: ${colors.text};
`;

export const SecondaryText = props => (
  <div
    className={emotionCSS({
      ...truncateTextCSS(props),
      color: `${colors.subtleText(props)};`,
      fontSize: '0.85em;',
    })}
    {...props}
  />
);
export const scSecondaryText = styled.div`
  ${truncateTextCSS}
  color: ${colors.subtleText};
  font-size: 0.85em;
`;
