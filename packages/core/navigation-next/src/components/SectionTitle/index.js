// @flow

import React, { Component } from 'react';

import { light, withTheme } from '../../theme';
import type { SectionTitleProps } from './types';

class SectionTitle extends Component<SectionTitleProps> {
  static defaultProps = {
    theme: { mode: light, context: 'container' },
  };

  render() {
    const { after: After, children, theme } = this.props;
    const { mode, context } = theme;

    const styles = mode.sectionTitle()[context];

    return (
      <div css={styles.titleBase}>
        <div css={styles.textWrapper}>{children}</div>
        {!!After && (
          <div css={styles.afterWrapper}>
            <After />
          </div>
        )}
      </div>
    );
  }
}

export default withTheme(SectionTitle);
