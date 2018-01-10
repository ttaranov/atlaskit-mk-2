import React, { PureComponent } from 'react';
import { ThemeProvider } from 'styled-components';
import memoizeOne from 'memoize-one';
import { isElectronMacKey } from './util';
import type { ReactElement } from '../../src/types';

type Props = {
  isElectronMac?: boolean,
  children?: ReactElement,
};

const getTheme = memoizeOne((isElectronMac?: boolean) => ({
  [isElectronMacKey]: isElectronMac,
}));

export default class WithElectronTheme extends PureComponent {
  props: Props; // eslint-disable-line react/sort-comp

  static defaultProps = {
    isElectronMac: false,
  };

  render() {
    const theme = getTheme(this.props.isElectronMac);
    return <ThemeProvider theme={theme}>{this.props.children}</ThemeProvider>;
  }
}
