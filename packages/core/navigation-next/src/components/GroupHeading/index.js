// @flow

import React from 'react';

import { light, withTheme } from '../../theme';
import type { GroupHeadingProps } from './types';

const GroupHeading = ({ after: After, children, theme }: GroupHeadingProps) => {
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

export default withTheme({ mode: light, context: 'container' })(GroupHeading);
