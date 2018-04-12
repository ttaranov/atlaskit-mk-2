// @flow

import React, { Component } from 'react';

import { light, withTheme } from '../../theme';
import type { Theme } from '../../theme/types';

type Props = {
  theme: Theme,
};

class SectionSeparator extends Component<Props> {
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
