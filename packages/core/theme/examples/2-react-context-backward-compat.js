// @flow

import React, { Component, Fragment } from 'react';
import Button from '@atlaskit/button';
import { AtlaskitThemeProvider, Theme, Themed } from '../src';

type Props = {};
type State = { mode: 'light' | 'dark' };

const newThemes = {
  default: { color: 'red' },
  dark: { color: 'papayawhip' },
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
    return (
      <AtlaskitThemeProvider mode={mode}>
        <Button onClick={this.switchTheme}>
          Switch theme - this button is using the old API ({mode})
        </Button>
        <Themed>
          {theme => {
            const style = {
              color: theme.mode === 'dark' ? 'pink' : 'blue',
            };
            return (
              <Fragment>
                <p style={style}>
                  This paragraph is using the new{' '}
                  <code>&lt;Context.Provider&gt;</code> component.
                </p>
              </Fragment>
            );
          }}
        </Themed>
        <Themed themes={newThemes}>
          {theme => (
            <Fragment>
              <p style={{ color: theme.color }}>
                This paragraph is using the new <code>&lt;Theme&gt;</code>{' '}
                component.
              </p>
            </Fragment>
          )}
        </Themed>
      </AtlaskitThemeProvider>
    );
  }
}
