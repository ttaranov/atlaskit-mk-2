// @flow

import type { GlobalItemPresentationProps } from '../components/GlobalItem/types';
import type { ItemPresentationProps } from '../components/Item/types';
import type { SectionPresentationProps } from '../components/Section/types';

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

// This is the shape of a theme 'mode', e.g. light, dark, settings or custom
export type Mode = {
  globalItem: GlobalNavigationComponentTheme<GlobalItemPresentationProps>,
  globalNav: GlobalNavigationComponentTheme<void>,
  heading: ContentNavigationComponentTheme<void>,
  item: ContentNavigationComponentTheme<ItemPresentationProps>,
  contentNav: ContentNavigationComponentTheme<void>,
  scrollHint: ContentNavigationComponentTheme<void>,
  section: ContentNavigationComponentTheme<SectionPresentationProps>,
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

export type StyleReducer = (
  Styles: ObjectType,
  State?: ObjectType,
  Theme?: ProductTheme,
) => ObjectType;

export type ContextColors = {
  background: {
    /**
     * Color provided to the mode generator */
    default: string,
    /**
     * Generated color, usually brighter
     * Used as nav item hover background */
    hint: string,
    /**
     * Generated color, gentle variation over default
     * Used as nav item active background */
    interact: string,
    /**
     * Generated color, either lighter or darker of default
     * Used as nav item selected background, separator background, ... */
    static: string,
  },
  text: {
    /**
     * Color provided to the mode generator */
    default: string,
    /**
     * Generated color, slighly faded out
     * Used as nav item sub text color and group headings color */
    subtle: string,
  },
};

export type ModeColors = {
  product: ContextColors,
};
