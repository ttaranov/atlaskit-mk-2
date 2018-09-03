// @flow

import { colors } from '@atlaskit/theme';

import modeGenerator from './modeGenerator';

export const light = modeGenerator({
  product: {
    text: colors.N0,
    background: colors.B500,
  },
});

export const dark = modeGenerator({
  product: {
    text: colors.DN500,
    background: colors.DN0,
  },
});
