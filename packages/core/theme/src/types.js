// @flow

import { type Node } from 'react';

// Deprecated / legacy types
export type ThemeModes = 'light' | 'dark';
export type Theme = { mode: ThemeModes };
export type ThemeProps = {
  theme: { __ATLASKIT_THEME__: Theme },
};
export type ThemedValue = (props: ?ThemeProps) => string | number;

// Non-deprecated types
export type colorPaletteType = '8' | '16' | '24';

// New types
export type ThemeBaseValue = boolean | number | string | void;
export type ThemeInput = { [string]: ThemeInputValue };
export type ThemeInputFunction = (*, ThemeOutput) => *;
export type ThemeInputValue = ThemeInputFunction | ThemeBaseValue;
export type ThemeOutput = { [string]: ThemeOutputValue };
export type ThemeOutputFunction = (*) => ThemeOutput;
export type ThemeOutputValue = *;

export type ThemeDefinition<Values: ThemeOutput> = {
  children?: (Values => Node) | Node,
  values?: Values,
};

// Themes
export type ThemeReset = {
  backgroundColor: string,
  textColor: string,
  linkColor?: string,
  linkColorHover?: string,
  linkColorActive?: string,
  linkColorOutline?: string,
  headingColor?: string,
  subtleHeadingColor?: string,
  subtleTextColor?: string,
};
