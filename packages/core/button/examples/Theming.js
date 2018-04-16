// @flow
import React from 'react';
import styled, { ThemeProvider, css } from 'styled-components';
import PersonIcon from '@atlaskit/icon/glyph/person';
import { themed, colors } from '@atlaskit/theme';
import Button, { ButtonGroup, themeNamespace } from '../src';

const appearances = ['primary'];

const theme = {
  primary: {
    background: {
      default: themed({ light: colors.P400, dark: colors.P400 }),
      hover: themed({ light: colors.P200, dark: colors.P200 }),
      active: themed({ light: colors.P500, dark: colors.P500 }),
      disabled: themed({ light: colors.N30, dark: colors.DN70 }),
      selected: themed({ light: colors.R500, dark: colors.R500 }),
    },
    boxShadowColor: {
      focus: themed({ light: colors.P100, dark: colors.P100 }),
    },
    color: {
      default: themed({ light: colors.N0, dark: colors.N0 }),
      disabled: themed({ light: colors.N0, dark: colors.DN30 }),
      selected: themed({ light: colors.N0, dark: colors.N0 }),
    },
  },
};

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

const TrelloButton = styled.button`
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
    console.log('appearance', appearance);
    if (appearance === 'primary') {
      return primaryStyle;
    } else if (appearance === 'danger') {
      return dangerStyle;
    }
    return defaultStyle;
  }};
`;
const ButtonComponent = ({ appearance, children }) => (
  <TrelloButton appearance={appearance}>{children}</TrelloButton>
);
const ButtonWrapper = styled.div``;
const ButtonContent = styled.div``;
const IconWrapper = styled.div``;

export default () => (
  <div>
    <h3>Theming a Primary button</h3>
    {appearances.map(appearance => (
      <div key={appearance}>
        <h4>Themed:</h4>
        <ThemeProvider theme={{ [themeNamespace]: theme }}>
          <ButtonGroup>
            <Button appearance={appearance}>Button</Button>
            <Button appearance={appearance} isDisabled>
              Disabled button
            </Button>
            <Button appearance={appearance} isSelected>
              Selected
            </Button>
          </ButtonGroup>
        </ThemeProvider>
        <h4>Un-themed</h4>
        <ButtonGroup>
          <Button appearance={appearance}>Button</Button>
          <Button appearance={appearance} isDisabled>
            Disabled button
          </Button>
          <Button appearance={appearance} isSelected>
            Selected
          </Button>
        </ButtonGroup>
      </div>
    ))}
    <h4>Trello</h4>
    <span>
      <Button iconBefore={<PersonIcon />} component={ButtonComponent} compact>
        default trello button
      </Button>
      <Button component={ButtonComponent} appearance="primary">
        primary trello button
      </Button>
      <Button component={ButtonComponent} appearance="danger">
        danger trello button
      </Button>
    </span>
    <h4>Random</h4>
    <span>
      <Button component={({ children }) => <button>{children}</button>} compact>
        default trello button
      </Button>
    </span>
  </div>
);
