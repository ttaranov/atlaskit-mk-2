// @flow

import { colors, gridSize as gridSizeFn } from '@atlaskit/theme';

import type { ThemedContentNavigationComponentStyles } from '../../theme/types';

const gridSize = gridSizeFn();

// These are the styles which are consistent regardless of theme
const baseStyles = {
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    height: `${gridSize * 5}`,
    paddingLeft: `${gridSize * 1.5}px`,
    paddingRight: `${gridSize * 1.5}px`,
    opacity: 0.15,
  },
  before: {
    backgroundColor: 'red',
    borderRadius: '50%',
    flexShrink: 0,
    height: `${gridSize * 3}px`,
    marginRight: `${gridSize * 2}px`,
    width: `${gridSize * 3}px`,
  },
  content: {
    borderRadius: `${gridSize / 2}px`,
    flexGrow: 1,
    height: `${gridSize * 2.5}px`,
  },
};

// Light theme
const light = () => ({
  container: {
    wrapper: baseStyles.wrapper,
    before: {
      ...baseStyles.before,
      backgroundColor: colors.N500,
    },
    content: {
      ...baseStyles.content,
      backgroundColor: colors.N500,
    },
  },
  product: {
    wrapper: baseStyles.wrapper,
    before: {
      ...baseStyles.before,
      backgroundColor: colors.B50,
    },
    content: {
      ...baseStyles.content,
      backgroundColor: colors.B50,
    },
  },
});

// Dark theme
const dark = () => ({
  container: {
    wrapper: baseStyles.wrapper,
    before: {
      ...baseStyles.before,
      backgroundColor: colors.DN400,
    },
    content: {
      ...baseStyles.content,
      backgroundColor: colors.DN400,
    },
  },
  product: {
    wrapper: baseStyles.wrapper,
    before: {
      ...baseStyles.before,
      backgroundColor: colors.DN400,
    },
    content: {
      ...baseStyles.content,
      backgroundColor: colors.DN400,
    },
  },
});

// Settings theme
const settings = () => ({
  container: {
    wrapper: baseStyles.wrapper,
    before: {
      ...baseStyles.before,
      backgroundColor: colors.N0,
    },
    content: {
      ...baseStyles.content,
      backgroundColor: colors.N0,
    },
  },
  product: {
    wrapper: baseStyles.wrapper,
    before: {
      ...baseStyles.before,
      backgroundColor: colors.N0,
    },
    content: {
      ...baseStyles.content,
      backgroundColor: colors.N0,
    },
  },
});

const themes: ThemedContentNavigationComponentStyles<void> = {
  dark,
  light,
  settings,
};
export default themes;
