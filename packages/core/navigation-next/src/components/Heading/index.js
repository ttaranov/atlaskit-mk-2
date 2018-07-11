// @flow

import React from 'react';

import { light, withTheme } from '../../theme';
import type { HeadingProps } from './types';

const Heading = ({ after: After, children, theme }: HeadingProps) => {
  const { mode, context } = theme;
  const styles = mode.heading()[context];

  return (
    <div css={styles.headingBase}>
      <div css={styles.textWrapper}>{children}</div>
      {!!After && (
        <div css={styles.afterWrapper}>
          <After />
        </div>
      )}
    </div>
  );
};

export default withTheme({ mode: light, context: 'container' })(Heading);
