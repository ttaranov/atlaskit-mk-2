// @flow
import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import ToggleStatelessWithTheme from './ToggleStatelessWithTheme';
import defaultBaseProps from './defaultBaseProps';
import type { StatelessProps, DefaultBaseProps } from './types';

type DefaultProps = DefaultBaseProps & {
  isChecked: boolean,
};

const emptyTheme = {};

export default class ToggleStateless extends Component<StatelessProps> {
  static defaultProps: DefaultProps = {
    ...defaultBaseProps,
    isChecked: false,
  };

  // This will inject the 'theme' prop onto the child component
  render() {
    return (
      <ThemeProvider theme={emptyTheme}>
        <ToggleStatelessWithTheme {...this.props} />
      </ThemeProvider>
    );
  }
}
