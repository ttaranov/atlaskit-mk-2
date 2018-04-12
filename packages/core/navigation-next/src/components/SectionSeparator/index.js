// @flow

import React, { Component } from 'react';

import { light, withTheme } from '../../theme';
import type { SectionSeparatorProps } from './types';

class SectionSeparator extends Component<SectionSeparatorProps> {
  static defaultProps = {
    theme: { mode: light, context: 'container' },
  };

  render() {
    const { mode, context } = this.props.theme;
    const styles = mode.sectionSeparator()[context];
    return <div css={styles} />;
  }
}

export default withTheme(SectionSeparator);
