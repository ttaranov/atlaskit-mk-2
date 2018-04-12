// @flow

import React, { Component, type ComponentType, type Node } from 'react';

import type { Theme } from '../../theme/types';
import { light, withTheme } from '../../theme';

type Props = {
  after?: ComponentType<*>,
  children: Node,
  theme: Theme,
};

class SectionTitle extends Component<Props> {
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
