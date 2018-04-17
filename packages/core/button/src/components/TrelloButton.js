// @flow
import React from 'react';
import { css } from 'styled-components';
import ButtonBase from './Button-v2';
import { type ButtonProps } from '../types';

const defaultStyle = css`
  &:not([disabled]):focus,
  &:not([disabled]):hover {
    background: -webkit-linear-gradient(top, #d6dadc 0%, #cdd2d4 100%);
    background: linear-gradient(to bottom, #d6dadc 0%, #cdd2d4 100%);
    color: #4d4d4d;
  }

  &:not([disabled]):active {
    background: -webkit-linear-gradient(top, #cdd2d4 0%, #c4c9cc 100%);
    background: linear-gradient(to bottom, #cdd2d4 0%, #c4c9cc 100%);
    color: #4d4d4d;
  }
`;

const primaryStyle = css`
  &:not([disabled]) {
    background: -webkit-linear-gradient(top, #61bd4f 0%, #5aac44 100%);
    background: linear-gradient(to bottom, #61bd4f 0%, #5aac44 100%);
    box-shadow: 0 2px 0 #3f6f21;
    color: #fff;
    padding: 0.6em 2.2em;
  }

  &:not([disabled]):focus,
  &:not([disabled]):hover {
    background: -webkit-linear-gradient(top, #5aac44 0%, #519839 100%);
    background: linear-gradient(to bottom, #5aac44 0%, #519839 100%);
    color: #fff;
  }

  &:not([disabled]):active {
    background: -webkit-linear-gradient(top, #519839 0%, #49852e 100%);
    background: linear-gradient(to bottom, #519839 0%, #49852e 100%);
    color: #fff;
  }
`;

const dangerStyle = css`
  :not([disabled]) {
    color: #eb5a46;
  }

  :not([disabled]):focus,
  :not([disabled]):hover {
    background: -webkit-linear-gradient(top, #eb5a46 0%, #cf513d 100%);
    background: linear-gradient(to bottom, #eb5a46 0%, #cf513d 100%);
    box-shadow: 0 2px 0 #6e2f1a;
    color: #fff;
  }

  :not([disabled]):active {
    background: -webkit-linear-gradient(top, #cf513d 0%, #b04632 100%);
    background: linear-gradient(to bottom, #cf513d 0%, #b04632 100%);
    box-shadow: 0 2px 0 #6e2f1a;
    color: #fff;
  }
`;

const rootStyles = css`
  background: -webkit-linear-gradient(top, #e2e4e6 0%, #d6dadc 100%);
  background: linear-gradient(to bottom, #e2e4e6 0%, #d6dadc 100%);
  border: 0;
  border-radius: 3px;
  box-shadow: 0 2px 0 #959da1;
  color: #4d4d4d;
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
