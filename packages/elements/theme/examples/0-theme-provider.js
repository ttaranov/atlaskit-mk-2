// @flow
import React, { Component } from 'react';
import { AtlasKitThemeProvider } from '../';
import Button from '@atlaskit/button';

type Props = {};
type State = { themeMode: 'light' | 'dark' };

export default class extends Component<Props, State> {
  state = { themeMode: 'light' };
  switchTheme = () => {
    const { themeMode } = this.state;
    this.setState({
      themeMode: themeMode === 'light' ? 'dark' : 'light',
    });
  };
  render() {
    const { themeMode } = this.state;
    return (
      <AtlasKitThemeProvider mode={themeMode}>
        Theme: {themeMode} <Button onClick={this.switchTheme}>Switch</Button>
      </AtlasKitThemeProvider>
    );
  }
}
