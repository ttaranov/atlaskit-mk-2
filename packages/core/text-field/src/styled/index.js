// @flow

import styled, { css } from 'styled-components';
import {
  codeFontFamily,
  gridSize,
  fontSize,
  colors,
  themed,
} from '@atlaskit/theme';
import {
  getBackgroundColor,
  getBackgroundColorFocus,
  getBackgroundColorHover,
  getBorderColor,
  getBorderColorFocus,
} from '../theme';

const borderRadius = '3px';
const borderWidth = 2;
const grid = gridSize();
const lineHeightBase = grid * 2.5;
const lineHeightCompact = grid * 2;
const heightBase = grid * 5;
const heightCompact = grid * 4;
const horizontalPadding = grid;
const innerHeight = grid * 3;
const transitionDuration = '0.2s';

// TODO Think about how to `theming` newer/better.
const getColor = themed({ light: colors.N900, dark: colors.DN600 });

const getPadding = ({ compact }) => {
  const height = compact ? heightCompact : heightBase;
  return css`
    padding: ${(height - 2 * borderWidth - innerHeight) / 2}px
      ${horizontalPadding - borderWidth}px;
  `;
};

const getLineHeight = ({ compact }) => {
  const currentLineHeight = compact ? lineHeightCompact : lineHeightBase;
  return currentLineHeight / fontSize();
};

const getDisabledColor = themed({ light: colors.N70, dark: colors.DN90 });

const getDisabledState = props =>
  props.isDisabled &&
  css`
    color: ${getDisabledColor(props)};
    pointer-events: none;
  `;

const getHoverState = props => {
  if (props.isReadOnly || props.isFocused || props.none) return null;

  return css`
    &:hover {
      background-color: ${getBackgroundColorHover(props)};
    }
  `;
};

const getBorderStyle = ({ appearance }) =>
  appearance === 'none' ? 'none' : 'solid';

const getMinHeight = ({ compact }) => {
  const minHeight = compact ? heightCompact : heightBase;
  return css`
    min-height: ${minHeight}px;
  `;
};

const getPlaceholderColor = ({ isDisabled }) => {
  if (isDisabled) return themed({ light: colors.N70, dark: colors.DN90 });
  else return themed({ light: colors.N100, dark: colors.DN90 });
};

// can't group these placeholder styles into one block because browsers drop
// entire style blocks when any single selector fails to parse
const getPlaceholderStyle = () => css`
  &::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: ${getPlaceholderColor};
  }
  &::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: ${getPlaceholderColor};
    opacity: 1;
  }
  &::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${getPlaceholderColor};
  }
  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${getPlaceholderColor};
  }
`;

// Safari puts on some difficult to remove styles, mainly for disabled inputs
// but we want full control so need to override them in all cases
const overrideSafariDisabledStyles = `
  -webkit-text-fill-color: unset;
  -webkit-opacity: 1;
`;

export const Wrapper = styled.div`
  flex: 1 1 100%;
  ${p => (p.maxWidth ? `max-width: ${p.maxWidth}px` : '100%')};
`;

export const InputWrapper = styled.div`
  align-items: center;
  background-color: ${p =>
    p.isFocused ? getBackgroundColorFocus(p) : getBackgroundColor(p)};
  border-color: ${p =>
    p.isFocused ? getBorderColorFocus(p) : getBorderColor(p)};
  border-radius: ${borderRadius};
  border-width: ${borderWidth}px;
  border-style: ${getBorderStyle};
  display: inline-block;
  box-sizing: border-box;
  color: ${getColor};
  display: flex;
  flex: 1 0 auto;
  font-size: ${fontSize}px;
  justify-content: space-between;
  line-height: ${getLineHeight};
  max-width: 100%;
  overflow: hidden;
  transition: background-color ${transitionDuration} ease-in-out, border-color ${transitionDuration} ease-in-out;
  word-wrap: break-word;
  vertical-align: top;
  ${p => p.disabled && `cursor: not-allowed;`}
  ${getPadding} ${getHoverState} ${getDisabledState};
  
  & > input {
    background: transparent;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    cursor: inherit;
    font-family: ${p => (p.isMonospaced ? codeFontFamily() : 'inherit')};
    font-size: ${fontSize}px;
    min-width: 0;
    outline: none;
    width: 100%;

    [disabled] {
      ${overrideSafariDisabledStyles};
    }

    &::-ms-clear {
      display: none;
    }

    &:invalid {
      box-shadow: none;
    }
    ${getPlaceholderStyle};
  }
`;
