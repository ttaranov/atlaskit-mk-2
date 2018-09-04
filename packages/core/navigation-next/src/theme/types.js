// @flow

import type { GlobalItemPresentationProps } from '../components/GlobalItem/types';
import type { ItemPresentationProps } from '../components/Item/types';

/**
 * Types
 */
type ObjectType = { [string]: * };

type ContentNavigationComponentThemeObject = {
  container: ObjectType,
  product: ObjectType,
};

type GlobalNavigationComponentTheme<Props: {} | void> = Props => ObjectType;

type ContentNavigationComponentTheme<
  Props: {} | void,
> = Props => ContentNavigationComponentThemeObject;

// Every component which responds to theming should export a
// ThemedGlobalNavigationComponentStyles or ThemedContentNavigationComponentStyles object from
// /styles.js
export type ThemedGlobalNavigationComponentStyles<Props> = {
  light: GlobalNavigationComponentTheme<Props>,
  dark: GlobalNavigationComponentTheme<Props>,
};

export type ThemedContentNavigationComponentStyles<Props> = {
  light: ContentNavigationComponentTheme<Props>,
  dark: ContentNavigationComponentTheme<Props>,
};

// This is the shape of a theme 'mode', e.g. light, dark and settings modes
export type Mode = {
  globalItem: GlobalNavigationComponentTheme<GlobalItemPresentationProps>,
  globalNav: GlobalNavigationComponentTheme<void>,
  heading: ContentNavigationComponentTheme<void>,
  item: ContentNavigationComponentTheme<ItemPresentationProps>,
  contentNav: ContentNavigationComponentTheme<void>,
  scrollHint: ContentNavigationComponentTheme<void>,
  separator: ContentNavigationComponentTheme<void>,
  skeletonItem: ContentNavigationComponentTheme<void>,
};

export type ProductTheme = {
  mode: Mode,
  context: string,
};

export type GlobalTheme = {
  mode: Mode,
};

// export type StyleReducer<State> = (ObjectType, State) => ObjectType;
export type StyleReducer = (
  Styles: ObjectType,
  State?: ObjectType,
) => ObjectType;

export type ContextColors = {
  background: {
    default: string,
    accent1: string,
    accent2: string,
    accent3: string,
  },
  text: {
    default: string,
    accent1: string,
  },
};

export type ModeColors = {
  product: ContextColors,
};
