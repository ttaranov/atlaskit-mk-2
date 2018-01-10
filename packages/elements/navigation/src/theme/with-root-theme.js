// @flow
import React, { PureComponent } from 'react';
import { ThemeProvider } from 'styled-components';
import { itemThemeNamespace } from '@atlaskit/item';
import memoizeOne from 'memoize-one';
import createItemTheme from './map-navigation-theme-to-item-theme';
import type { Provided, RootTheme } from './types';
import type { ReactElement } from '../../src/types';
import { rootKey } from './util';

type Props = {
  provided: Provided,
  isCollapsed?: boolean,
  children?: ReactElement,
};

export default class WithRootTheme extends PureComponent {
  props: Props; // eslint-disable-line react/sort-comp

  static defaultProps = {
    isCollapsed: false,
  };

  // We want to memoize the 'withOuterTheme' function based on the props that can affect it.
  // This achieves 2 things:
  // 1. A consistent function reference is passed to the ThemeProvider, which avoids it broadcasting
  //    updates to all components using the withTheme HOC
  // 2. The function reference will change if new 'provided' or 'isCollapsed' props are provided,
  //    which will force ThemeProvider to broadcast the update
  getWithOuterTheme = memoizeOne(
    (provided, isCollapsed) => (outerTheme: ?Object = {}): Object => {
      const theme: RootTheme = {
        isCollapsed: isCollapsed || false,
        provided,
      };

      return {
        ...outerTheme,
        [rootKey]: theme,
        [itemThemeNamespace]: createItemTheme(provided, isCollapsed),
      };
    },
  );

  render() {
    const withOuterTheme = this.getWithOuterTheme(
      this.props.provided,
      this.props.isCollapsed,
    );
    return (
      <ThemeProvider theme={withOuterTheme}>
        {this.props.children}
      </ThemeProvider>
    );
  }
}
