// @flow

import React, { Component } from 'react';

import { styleReducerNoOp, withContentTheme } from '../../../theme';
import SectionBase from './Section';
import type { ConnectedSectionProps } from './types';

const SectionWithTheme = withContentTheme(SectionBase);

export default function Section (props) {
  static defaultProps = {
    alwaysShowScrollHint: false,
    shouldGrow: false,
    styles: styleReducerNoOp,
  };
  render() {
    return <SectionWithTheme {...this.props} />;
  }
}
