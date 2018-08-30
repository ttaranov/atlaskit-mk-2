// @flow

import { colors, gridSize as gridSizeFn } from '@atlaskit/theme';

import contentNavThemes from '../ContentNavigation/styles';
import type { ThemedContentNavigationComponentStyles } from '../../theme/types';

const gridSize = gridSizeFn();

const scrollHintHeight = 2;
const scrollHintSpacing = gridSize * 2;

const isGecko =
  typeof window !== 'undefined' &&
  window.navigator.userAgent.indexOf('Gecko') >= 0;
const isWebkit =
  typeof window !== 'undefined' &&
  window.navigator.userAgent.indexOf('AppleWebKit') >= 0;
const scrollBarSize = isGecko || isWebkit ? 0 : 30;

const baseStyles = {
  wrapper: {
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',

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
    flexBasis: '100%',
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
  // These styles are passed to the children function for the consumer to
  // apply
  children: {
    boxSizing: 'border-box',
    paddingLeft: `${gridSize * 2}px`,
    paddingRight: `${gridSize * 2}px`,
  },
};

const light = () => ({
  container: {
    ...baseStyles,
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
    ...baseStyles,
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
    ...baseStyles,
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
    ...baseStyles,
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
    ...baseStyles,
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
    ...baseStyles,
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
