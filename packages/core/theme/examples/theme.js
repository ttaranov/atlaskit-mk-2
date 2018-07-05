// @flow

import React, { Component } from 'react';
import Button from '@atlaskit/button';
import { Reset, Theme, Themed } from '../src';

type Props = {};
type State = {
  color: 'light' | 'dark',
  size: 'big' | 'small',
};

const themes = {
  big: ({ children }) => <Theme gridSize={20}>{children}</Theme>,
  dark: ({ children }) => (
    <Theme backgroundColor="#555" textColor="#eee">
      {children}
    </Theme>
  ),
  light: ({ children }) => (
    <Theme backgroundColor="#eee" textColor="#555">
      {children}
    </Theme>
  ),
  small: ({ children }) => <Theme gridSize={10}>{children}</Theme>,
};

export default class extends Component<Props, State> {
  state = {
    color: 'light',
    size: 'small',
  };
  switchThemeColor = () => {
    const { color } = this.state;
    this.setState({
      color: color === 'light' ? 'dark' : 'light',
    });
  };
  switchThemeSize = () => {
    const { size } = this.state;
    this.setState({
      size: size === 'small' ? 'big' : 'small',
    });
  };
  render() {
    const { color, size } = this.state;
    const ThemeColor = themes[color];
    const ThemeSize = themes[size];
    return (
      <ThemeColor>
        <ThemeSize>
          <Themed>
            {({ backgroundColor, gridSize, textColor }) => (
              <Reset style={{ padding: gridSize }}>
                <Button onClick={this.switchThemeColor}>
                  Toggle color ({color})
                </Button>
                <span style={{ marginLeft: gridSize }}>
                  <Button onClick={this.switchThemeSize}>
                    Toggle size ({size})
                  </Button>
                </span>
                <p
                  style={{
                    color: textColor,
                    margin: `${gridSize}px 0`,
                  }}
                >
                  This is the new theming API.
                </p>
              </Reset>
            )}
          </Themed>
        </ThemeSize>
      </ThemeColor>
    );
  }
}
