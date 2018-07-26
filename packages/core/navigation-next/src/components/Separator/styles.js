// @flow

import { colors, gridSize } from '@atlaskit/theme';

import type { ThemedContentNavigationComponentStyles } from '../../theme/types';

const dividerLineHeight = 2;
const dividerTotalHeight = gridSize() * 5;

const baseStyles = {
  borderRadius: '1px',
  flexShrink: 0,
  height: `${dividerLineHeight}px`,
  margin: `${(dividerTotalHeight - dividerLineHeight) / 2}px 0`,
};

const light = () => ({
  container: { ...baseStyles, backgroundColor: colors.N30A },
  product: { ...baseStyles, backgroundColor: colors.N80A },
});

const dark = () => ({
  container: { ...baseStyles, backgroundColor: colors.DN50 },
  product: { ...baseStyles, backgroundColor: colors.DN50 },
});

const settings = () => ({
  container: { ...baseStyles, backgroundColor: colors.N900 },
  product: { ...baseStyles, backgroundColor: colors.N900 },
});

const themes: ThemedContentNavigationComponentStyles<void> = {
  dark,
  light,
  settings,
};
export default themes;
