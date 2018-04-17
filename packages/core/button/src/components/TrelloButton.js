// @flow
import React from 'react';
import { css } from 'styled-components';
import ButtonBase from './Button-v2';
import { type ButtonProps } from '../types';

const colorFromTheme = (getter, fallback) => p =>
  p.theme.pallet ? getter(p.theme.pallet) : fallback;

const defaultStyle = css`
  &:not([disabled]):focus,
  &:not([disabled]):hover {
    background: ${colorFromTheme(pallet => pallet.primary.main, '#d6dadc')};
    box-shadow: 0 2px 0
      ${colorFromTheme(pallet => pallet.primary.dark, '#959da1')};
  }

  &:not([disabled]):active {
    background: ${colorFromTheme(pallet => pallet.primary.dark, '#c4c9cc ')};
    box-shadow: none;
    color: #fff;
  }
`;

const primaryStyle = css`
  &:not([disabled]) {
    background: #5aac44;
    box-shadow: 0 2px 0 #519839;
    color: #fff;
  }

  &:not([disabled]):focus,
  &:not([disabled]):hover {
    background: #519839;
    box-shadow: 0 2px 0 #49852e;
    color: #fff;
  }

  &:not([disabled]):active {
    background: #49852e;
    box-shadow: none;
    color: #fff;
  }
`;

const dangerStyle = css`
  :not([disabled]) {
    background: #eb5a46;
    box-shadow: 0 2px 0 #b04632;
    color: #fff;
  }

  :not([disabled]):focus,
  :not([disabled]):hover {
    background: #cf513d
    box-shadow: 0 2px 0 #933b27;
    color: #fff;
  }

  :not([disabled]):active {
    background: #933b27;
    box-shadow: none;
    color: #fff;
  }
`;

const rootStyles = css`
  background: ${colorFromTheme(pallet => pallet.primary.light, '#e2e4e6')};
  border: 0;
  border-radius: 3px;
  box-shadow: 0 2px 0
    ${colorFromTheme(pallet => pallet.primary.main, '#959da1')};
  color: ${colorFromTheme(pallet => pallet.primary.contrastText, '#4d4d4d')};
  display: inline-block;
  font-weight: 700 !important;
  height: 40px;
  margin: 0.3em 1em 1em 0;
  outline: 0;
  padding: 0.6em 1.4em;
  position: relative;
  text-decoration: none;

  [disabled] {
    background: #e2e4e6;
    box-shadow: none;
    color: #8c8c8c;
    cursor: default;
    font-weight: 300;
  }

  ${({ appearance }) => {
    if (appearance === 'primary') {
      return primaryStyle;
    } else if (appearance === 'danger') {
      return dangerStyle;
    }
    return defaultStyle;
  }};
`;

class Button extends React.Component<ButtonProps> {
  static defaultProps = {
    appearance: 'default',
    isDisabled: false,
    isSelected: false,
    spacing: 'default',
    type: 'button',
    shouldFitContainer: false,
  };

  render() {
    return <ButtonBase {...this.props} styles={{ root: rootStyles }} />;
  }
}

export default Button;
