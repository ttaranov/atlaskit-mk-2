// @flow
/* eslint-disable no-nested-ternary */

import { CHANNEL, DEFAULT_THEME_MODE } from '../constants';
import { type Theme, type ThemeProps } from '../types';

const defaultTheme = { mode: DEFAULT_THEME_MODE };

export default function getTheme(props: ?ThemeProps): Theme {
  const theme = props && props.theme;
  return theme && theme[CHANNEL]
    ? theme[CHANNEL]
    : theme && theme.mode
      ? theme
      : defaultTheme;
}
