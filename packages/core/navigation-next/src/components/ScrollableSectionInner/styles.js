// @flow

import { colors, gridSize } from '@atlaskit/theme';

import contentNavThemes from '../ContentNavigation/styles';
import type { ThemedContentNavigationComponentStyles } from '../../theme/types';

const scrollHintHeight = 2;
const scrollHintSpacing = gridSize() * 2;

const isGecko =
  typeof window !== 'undefined' &&
  window.navigator.userAgent.indexOf('Gecko') >= 0;
const isWebkit =
  typeof window !== 'undefined' &&
  window.navigator.userAgent.indexOf('AppleWebKit') >= 0;
const scrollBarSize = isGecko || isWebkit ? 15 : 30;

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
        backgroundColor: contentNavThemes.light().container.backgroundColor,
      },
    },
  },
  product: {
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
        backgroundColor: contentNavThemes.light().product.backgroundColor,
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
        backgroundColor: contentNavThemes.dark().container.backgroundColor,
      },
    },
  },
  product: {
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
        backgroundColor: contentNavThemes.dark().product.backgroundColor,
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
        backgroundColor: contentNavThemes.settings().container.backgroundColor,
      },
    },
  },
  product: {
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
        backgroundColor: contentNavThemes.settings().product.backgroundColor,
      },
    },
  },
});

const themes: ThemedContentNavigationComponentStyles<void> = {
  dark,
  light,
  settings,
};
export default themes;
