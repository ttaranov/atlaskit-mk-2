// @flow

import React from 'react';

import { withContentTheme } from '../../theme';
import type { SeparatorProps } from './types';

const Separator = ({ theme }: SeparatorProps) => {
  const { mode, context } = theme;
  const styles = mode.separator()[context];
  return <div css={styles} />;
};

export default withContentTheme(Separator);
