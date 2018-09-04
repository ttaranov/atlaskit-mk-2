// @flow
import React, { Component } from 'react';
import { AtlaskitThemeProvider } from '@atlaskit/theme';
import { RadioGroup } from '../src';

const options = [
  { value: 'light', name: 'numbers', label: 'Light Mode' },
  { value: 'dark', name: 'numbers', label: 'Dark Mode' },
];

export default class ThemedRadio extends Component<
  *,
  { themeMode: 'light' | 'dark' },
> {
  state = {
    themeMode: 'dark',
  };

  switchTheme = ({ currentTarget: { value } }: SyntheticEvent<*>) => {
    this.setState({
      themeMode: value,
    });
  };
  render() {
    const { themeMode } = this.state;
    return (
      <AtlaskitThemeProvider mode={themeMode}>
        <RadioGroup
          defaultCheckedValue={this.state.themeMode}
          options={options}
          onChange={this.switchTheme}
        />
      </AtlaskitThemeProvider>
    );
  }
}
