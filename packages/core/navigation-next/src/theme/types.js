// @flow

import type { GlobalItemPresentationProps } from '../components/GlobalItem/types';
import type { ItemPresentationProps } from '../components/Item/types';

/**
 * Types
 */
type ObjectType = { [string]: * };

type ProductComponentThemeObject = { container: ObjectType, root: ObjectType };

type GlobalComponentTheme<Props: {} | void> = Props => ObjectType;

type ProductComponentTheme<
  Props: {} | void,
> = Props => ProductComponentThemeObject;

// Every component which responds to theming should export a
// ThemedGlobalComponentStyles or ThemedProductComponentStyles object from
// /styles.js
export type ThemedGlobalComponentStyles<Props> = {
  light: GlobalComponentTheme<Props>,
  dark: GlobalComponentTheme<Props>,
  settings: GlobalComponentTheme<Props>,
};

export type ThemedProductComponentStyles<Props> = {
  light: ProductComponentTheme<Props>,
  dark: ProductComponentTheme<Props>,
  settings: ProductComponentTheme<Props>,
};

// This is the shape of a theme 'mode', e.g. light, dark and settings modes
export type Mode = {
  globalItem: GlobalComponentTheme<GlobalItemPresentationProps>,
  globalNav: GlobalComponentTheme<void>,
  productNav: ProductComponentTheme<void>,
  item: ProductComponentTheme<ItemPresentationProps>,
  sectionTitle: ProductComponentTheme<void>,
  sectionSeparator: ProductComponentTheme<void>,
  scrollHint: ProductComponentTheme<void>,
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
