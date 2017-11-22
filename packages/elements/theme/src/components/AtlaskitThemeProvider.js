// @flow

import React, { Component, type Node } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

import type { ThemeModes, ThemeProps } from '../types';
import { background } from '../colors';
import ThemeReset from './ThemeReset';

import { CHANNEL, DEFAULT_THEME_MODE } from '../constants';

function getStylesheetResetCSS(state: ThemeProps) {
  const backgroundColor = background(state);
  return `
    body { background: ${backgroundColor}; }
  `;
}

type Props = {
  children: Node,
  mode: ThemeModes,
};

function buildThemeState(mode): ThemeProps {
  return { theme: { [CHANNEL]: { mode } } };
}

export default class AtlaskitThemeProvider extends Component<
  Props,
  ThemeProps,
> {
  stylesheet: any;
  static defaultProps = {
    mode: DEFAULT_THEME_MODE,
  };
  static childContextTypes = {
    hasAtlaskitThemeProvider: PropTypes.bool,
  };
  static contextTypes = {
    hasAtlaskitThemeProvider: PropTypes.bool,
  };
  constructor(props: Props) {
    super(props);
    this.state = buildThemeState(props.mode);
  }
  getChildContext() {
    return { hasAtlaskitThemeProvider: true };
  }
  componentWillMount() {
    if (!this.context.hasAtlaskitThemeProvider) {
      const css = getStylesheetResetCSS(this.state);
      this.stylesheet = document.createElement('style');
      this.stylesheet.type = 'text/css';
      this.stylesheet.innerHTML = css;
      if (document && document.head) {
        document.head.appendChild(this.stylesheet);
      }
    }
  }
  componentWillReceiveProps(newProps: Props) {
    if (newProps.mode !== this.props.mode) {
      const newThemeState = buildThemeState(newProps.mode);
      if (this.stylesheet) {
        const css = getStylesheetResetCSS(newThemeState);
        this.stylesheet.innerHTML = css;
      }
      this.setState(newThemeState);
    }
  }
  componentWillUnmount() {
    if (this.stylesheet && document && document.head) {
      document.head.removeChild(this.stylesheet);
      delete this.stylesheet;
    }
  }
  render() {
    const { children } = this.props;
    const theme = this.state.theme;
    return (
      <ThemeProvider theme={theme}>
        <ThemeReset>{children}</ThemeReset>
      </ThemeProvider>
    );
  }
}
