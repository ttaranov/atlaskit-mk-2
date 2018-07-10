// @flow

import React from 'react';

import { light, withTheme } from '../../theme';
import type { SeparatorProps } from './types';

const Separator = ({ theme }: SeparatorProps) => {
  const { mode, context } = theme;
  const styles = mode.sectionSeparator()[context];
  return <div css={styles} />;
};

export default withTheme({ mode: light, context: 'container' })(Separator);
