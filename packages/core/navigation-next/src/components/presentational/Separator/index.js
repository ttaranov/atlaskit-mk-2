// @flow

import React, { Component } from 'react';

import { withContentTheme } from '../../../theme';
import type { ConnectedSeparatorProps, SeparatorProps } from './types';

const SeparatorWithTheme = withContentTheme(({ theme }: SeparatorProps) => {
  const { mode, context } = theme;
  const styles = mode.separator()[context];
  return <div css={styles} />;
});

export default function Separator (props) {
  render() {
    return <SeparatorWithTheme {...this.props} />;
  }
}
