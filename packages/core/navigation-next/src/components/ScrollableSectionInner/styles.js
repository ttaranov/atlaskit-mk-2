// @flow

import { colors, gridSize } from '@atlaskit/theme';

import productNavThemes from '../ProductNav/styles';
import type { ThemedProductComponentStyles } from '../../theme/types';

const scrollHintHeight = 2;
const scrollHintSpacing = gridSize() * 2;

const isGecko = window && window.navigator.userAgent.indexOf('Gecko') >= 0;
const isWebkit =
  window && window.navigator.userAgent.indexOf('AppleWebKit') >= 0;
const scrollBarSize = isGecko || isWebkit ? 15 : 30;
// console.log(window.navigator.userAgent);

const baseStyles = {
  wrapper: {
    flex: '1 1 100%',
    overflow: 'hidden',
    position: 'relative',

    '&::before': {
      content: "''",
      display: 'block',
      flex: 0,
      height: `${scrollHintHeight}px`,
      left: `${scrollHintSpacing}px`,
      position: 'absolute',
      right: `${scrollHintSpacing + scrollBarSize}px`,
      top: 0,
      zIndex: 1,
    },
  },
  inner: {
    height: '100%',
    justifyContent: 'flex-start',
    overflowY: 'auto',
    position: 'relative',

    '&::before': {
      content: "''",
      display: 'block',
      flexShrink: 0,
      height: `${scrollHintHeight}px`,
      left: `${scrollHintSpacing}px`,
      position: 'absolute',
      right: `${scrollHintSpacing}px`,
      top: 0,
      zIndex: 2,
    },
  },
};

const light = () => ({
  container: {
    wrapper: {
      ...baseStyles.wrapper,
      '&::before': {
        ...baseStyles.wrapper['&::before'],
        backgroundColor: colors.N30A,
      },
    },
    inner: {
      ...baseStyles.inner,
      '&::before': {
        ...baseStyles.inner['&::before'],
        backgroundColor: productNavThemes.light().container.backgroundColor,
      },
    },
  },
  root: {
    wrapper: {
      ...baseStyles.wrapper,
      '&::before': {
        ...baseStyles.wrapper['&::before'],
        backgroundColor: colors.N80A,
      },
    },
    inner: {
      ...baseStyles.inner,
      '&::before': {
        ...baseStyles.inner['&::before'],
        backgroundColor: productNavThemes.light().root.backgroundColor,
      },
    },
  },
});

const dark = () => ({
  container: {
    wrapper: {
      ...baseStyles.wrapper,
      '&::before': {
        ...baseStyles.wrapper['&::before'],
        backgroundColor: colors.DN50,
      },
    },
    inner: {
      ...baseStyles.inner,
      '&::before': {
        ...baseStyles.inner['&::before'],
        backgroundColor: productNavThemes.dark().container.backgroundColor,
      },
    },
  },
  root: {
    wrapper: {
      ...baseStyles.wrapper,
      '&::before': {
        ...baseStyles.wrapper['&::before'],
        backgroundColor: colors.DN50,
      },
    },
    inner: {
      ...baseStyles.inner,
      '&::before': {
        ...baseStyles.inner['&::before'],
        backgroundColor: productNavThemes.dark().root.backgroundColor,
      },
    },
  },
});

const settings = () => ({
  container: {
    wrapper: {
      ...baseStyles.wrapper,
      '&::before': {
        ...baseStyles.wrapper['&::before'],
        backgroundColor: colors.N900,
      },
    },
    inner: {
      ...baseStyles.inner,
      '&::before': {
        ...baseStyles.inner['&::before'],
        backgroundColor: productNavThemes.settings().container.backgroundColor,
      },
    },
  },
  root: {
    wrapper: {
      ...baseStyles.wrapper,
      '&::before': {
        ...baseStyles.wrapper['&::before'],
        backgroundColor: colors.N900,
      },
    },
    inner: {
      ...baseStyles.inner,
      '&::before': {
        ...baseStyles.inner['&::before'],
        backgroundColor: productNavThemes.settings().root.backgroundColor,
      },
    },
  },
});

const themes: ThemedProductComponentStyles<void> = { dark, light, settings };
export default themes;
