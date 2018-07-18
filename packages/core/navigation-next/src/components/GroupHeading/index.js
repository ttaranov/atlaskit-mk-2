// @flow

import React from 'react';

import { withContentTheme } from '../../theme';
import type { GroupHeadingPrimitiveProps } from './types';

const GroupHeading = ({
  after: After,
  children,
  theme,
}: GroupHeadingPrimitiveProps) => {
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

export default withContentTheme(GroupHeading);
