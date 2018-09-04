// @flow
import React, { Component } from 'react';
import { AtlaskitThemeProvider } from '@atlaskit/theme';
import Button from '@atlaskit/button';
import { RadioGroup } from '../src';

const options = [
  { value: 'one', name: 'numbers', label: 'One' },
  { value: 'two', name: 'numbers', label: 'Two' },
  { value: 'three', name: 'numbers', label: 'Three' },
];

export default class ThemedRadio extends Component<
  *,
  { themeMode: 'light' | 'dark' },
> {
  state = {
    themeMode: 'light',
  };

  switchTheme = () => {
    const { themeMode } = this.state;
    this.setState({
      themeMode: themeMode === 'light' ? 'dark' : 'light',
    });
  };
  render() {
    const { themeMode } = this.state;
    return (
      <AtlaskitThemeProvider mode={themeMode}>
        <RadioGroup options={options} onChange={() => {}} />
        <Button onClick={this.switchTheme}> Switch Theme {themeMode} </Button>
      </AtlaskitThemeProvider>
    );
  }
}
