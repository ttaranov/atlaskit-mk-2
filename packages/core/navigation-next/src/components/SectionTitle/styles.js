// @flow

import { colors, gridSize } from '@atlaskit/theme';

import type { ThemedProductComponentStyles } from '../../theme/types';

const fontSize = 11;

const baseStyles = {
  titleBase: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    fontSize: `${fontSize}px`,
    fontWeight: 600,
    lineHeight: gridSize() * 2 / fontSize,
    margin: `${gridSize() * 2.5}px 0 ${gridSize()}px`,
    padding: `0 ${gridSize() / 2}px`,
    textTransform: 'uppercase',
  },
  textWrapper: {
    flexGrow: 1,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  afterWrapper: {
    lineHeight: 1,
    marginLeft: `${gridSize() / 2}px`,
  },
};

const light = () => ({
  container: {
    ...baseStyles,
    titleBase: { ...baseStyles.titleBase, color: colors.N200 },
  },
  root: {
    ...baseStyles,
    titleBase: { ...baseStyles.titleBase, color: colors.B75 },
  },
});

const dark = () => ({
  container: {
    ...baseStyles,
    titleBase: { ...baseStyles.titleBase, color: colors.DN100 },
  },
  root: {
    ...baseStyles,
    titleBase: { ...baseStyles.titleBase, color: colors.DN100 },
  },
});

const settings = () => ({
  container: {
    ...baseStyles,
    titleBase: { ...baseStyles.titleBase, color: colors.N70 },
  },
  root: {
    ...baseStyles,
    titleBase: { ...baseStyles.titleBase, color: colors.N70 },
  },
});

const themes: ThemedProductComponentStyles<void> = { dark, light, settings };
export default themes;
