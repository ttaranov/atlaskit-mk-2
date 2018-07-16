// @flow

import React from 'react';

import { withContentTheme } from '../../theme';
import type { SectionSeparatorProps } from './types';

const SectionSeparator = ({ theme }: SectionSeparatorProps) => {
  const { mode, context } = theme;
  const styles = mode.sectionSeparator()[context];
  return <div css={styles} />;
};

export default withContentTheme(SectionSeparator);
