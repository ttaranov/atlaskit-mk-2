// @flow
import styled, { css } from 'styled-components';
import { gridSize, fontSize, colors, themed } from '@atlaskit/theme';
import {
  getBackgroundColor,
  getBackgroundColorFocus,
  getBackgroundColorHover,
  getBorderColor,
  getBorderColorFocus,
  getBorderColorHover,
} from './theme';

const borderRadius = '5px';
const borderWidth = 1;
const borderWidthFocused = 2;
// subtle border needs to match the focused thickness to avoid jank when transitioning on focus
const borderWidthSubtle = borderWidthFocused;
const spacing = gridSize();
const lineHeightBase = 20;
const lineHeightCompact = 16;
const heightBase = spacing * 5;
const heightCompact = spacing * 4;
const horizontalPadding = spacing;
const innerHeight = spacing * 3;
const transitionDuration = '0.2s';

const getBorderAndPadding = ({
  paddingDisabled,
  invalid,
  isFocused,
  compact,
  subtle,
  none,
}) => {
  let border;
  const height = compact ? heightCompact : heightBase;

  if (invalid || isFocused || none) border = borderWidthFocused;
  else if (subtle) border = borderWidthSubtle;
  else border = borderWidth;

  const padding = paddingDisabled
    ? `${borderWidthFocused - border}px`
    : `${(height - 2 * border - innerHeight) / 2}px ${horizontalPadding -
        border}px`;

  return css`
    border-width: ${border}px;
    padding: ${padding};
  `;
};

const getLineHeight = props => {
  const currentLineHeight = props.compact ? lineHeightCompact : lineHeightBase;

  return currentLineHeight / fontSize();
};

const getDisabledColor = themed({ light: colors.N60, dark: colors.DN90 });

const getDisabledState = props =>
  props.disabled &&
  css`
    color: ${getDisabledColor(props)};
    pointer-events: none;
  `;

const getHoverState = props => {
  if (props.readOnly || props.isFocused || props.none) return null;

  return css`
    &:hover {
      background-color: ${getBackgroundColorHover(props)};
      border-color: ${getBorderColorHover(props)};
    }
  `;
};

const getBorderStyle = props =>
  props.appearance === 'none' ? 'none' : 'solid';

const getMinHeight = ({ compact }) => {
  const minHeight = compact ? heightCompact : heightBase;
  return css`
    min-height: ${minHeight}px;
  `;
};

// need an element wrapping the children because IE11 doesn't apply min-height correctly
// to flex-elements. See https://github.com/philipwalton/flexbugs#3-min-height-on-a-flex-container-wont-apply-to-its-flex-items
export const ChildWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  max-width: 100%;
  ${p => getMinHeight(p)};
`;

const getColor = themed({ light: colors.N900, dark: colors.DN600 });

export const Content = styled.div`
  align-items: center;
  background-color: ${props =>
    props.isFocused
      ? getBackgroundColorFocus(props)
      : getBackgroundColor(props)};
  border-color: ${props =>
    props.isFocused ? getBorderColorFocus(props) : getBorderColor(props)};
  border-radius: ${borderRadius};
  border-style: ${getBorderStyle};
  box-sizing: border-box;
  color: ${getColor};
  display: flex;
  flex: 1 0 auto;
  font-size: ${fontSize}px;
  justify-content: space-between;
  line-height: ${getLineHeight};
  max-width: 100%;
  overflow: hidden;
  transition: background-color ${transitionDuration} ease-in-out,
    border-color ${transitionDuration} ease-in-out;
  word-wrap: break-word;
  ${getBorderAndPadding} ${getHoverState} ${getDisabledState};
`;

export const ContentWrapper = styled.div`
  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `} ${props =>
      props.grow
        ? css`
            flex: 1 0 auto;
          `
        : css`
            flex: 0 0 auto;
          `} ${props =>
      props.grow
        ? css`
            display: block;
          `
        : css`
            display: inline-block;
            vertical-align: top;
          `} ${props =>
      props.maxWidth
        ? css`
            max-width: ${props.maxWidth}px;
          `
        : css`
            max-width: 100%;
          `};
`;
