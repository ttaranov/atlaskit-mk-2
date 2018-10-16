// @flow

import React, { Component } from 'react';

import { styleReducerNoOp, withContentTheme } from '../../theme';
import SectionBase from './Section';
import type { ConnectedSectionProps } from './types';

const SectionWithTheme = withContentTheme(SectionBase);

export const getSectionDefaultProps = () => ({
  alwaysShowScrollHint: false,
  shouldGrow: false,
  styles: styleReducerNoOp,
});

export default class Section extends Component<ConnectedSectionProps> {
  static defaultProps = getSectionDefaultProps();
  render() {
    return <SectionWithTheme {...this.props} />;
  }
}
