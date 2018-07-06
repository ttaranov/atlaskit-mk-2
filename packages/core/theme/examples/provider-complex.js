// @flow

import React, { Component } from 'react';
import Button from '@atlaskit/button';
import { Reset, Provider, Themed } from '../src';

type Props = {};
type State = {
  color: 'light' | 'dark',
  size: 'big' | 'small',
};

const themes = {
  big: props => <Provider gridSize={20} {...props} />,
  dark: props => (
    <Provider backgroundColor="#555" textColor="#eee" {...props} />
  ),
  light: props => (
    <Provider backgroundColor="#eee" textColor="#555" {...props} />
  ),
  small: props => <Provider gridSize={10} {...props} />,
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
            {({ gridSize }) => (
              <Reset style={{ padding: gridSize }}>
                <Button onClick={this.switchThemeColor}>
                  Toggle color ({color})
                </Button>
                <span style={{ marginLeft: gridSize }}>
                  <Button onClick={this.switchThemeSize}>
                    Toggle size ({size})
                  </Button>
                </span>
              </Reset>
            )}
          </Themed>
        </ThemeSize>
      </ThemeColor>
    );
  }
}
