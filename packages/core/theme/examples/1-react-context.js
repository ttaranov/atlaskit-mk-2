// @flow

import React, { Component } from 'react';
import Button from '@atlaskit/button';
import { Theme, Themed } from '../src';

type Props = {};
type State = { mode: 'light' | 'dark' };

const themes = {
  dark: ({ children }) => (
    <Theme backgroundColor="#eee" textColor="#333">
      {children}
    </Theme>
  ),
  light: ({ children }) => (
    <Theme backgroundColor="#333" textColor="#eee">
      {children}
    </Theme>
  ),
};

export default class extends Component<Props, State> {
  state = { mode: 'light' };
  switchTheme = () => {
    const { mode } = this.state;
    this.setState({
      mode: mode === 'light' ? 'dark' : 'light',
    });
  };
  render() {
    const { mode } = this.state;
    const CurrentTheme = themes[mode];
    return (
      <CurrentTheme>
        <Button onClick={this.switchTheme}>Switch theme ({mode})</Button>
        <Themed>
          {({ backgroundColor, textColor: color }) => {
            return (
              <div style={{ backgroundColor, margin: '10px 0', padding: 10 }}>
                <p style={{ color }}>This is the new theming API.</p>
              </div>
            );
          }}
        </Themed>
      </CurrentTheme>
    );
  }
}
