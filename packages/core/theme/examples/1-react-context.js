// @flow

import React, { Component } from 'react';
import Button from '@atlaskit/button';
import { Context, Reset } from '../src';

type Props = {};
type State = { mode: 'light' | 'dark' };

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
    return (
      <Context.Provider value={{ mode }}>
        <Reset />
        <Button onClick={this.switchTheme}>Switch theme ({mode})</Button>
        <Context.Consumer>
          {theme => {
            return (
              <p style={{ color: theme.mode === 'light' ? 'black' : 'white' }}>
                This is the new theming API.
              </p>
            );
          }}
        </Context.Consumer>
      </Context.Provider>
    );
  }
}
