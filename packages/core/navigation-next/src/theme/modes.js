// @flow

import globalItem from '../components/GlobalItem/styles';
import globalNav from '../components/GlobalNav/styles';
import contentNav from '../components/ContentNavigation/styles';
import item from '../components/Item/styles';
import heading from '../components/GroupHeading/styles';
import separator from '../components/Separator/styles';
import scrollHint from '../components/ScrollableSectionInner/styles';
import skeletonItem from '../components/SkeletonItem/styles';

import type { Mode } from './types';

export const light: Mode = {
  globalItem: globalItem.light,
  globalNav: globalNav.light,
  contentNav: contentNav.light,
  item: item.light,
  heading: heading.light,
  separator: separator.light,
  scrollHint: scrollHint.light,
  skeletonItem: skeletonItem.light,
};

export const dark: Mode = {
  globalItem: globalItem.dark,
  globalNav: globalNav.dark,
  contentNav: contentNav.dark,
  item: item.dark,
  heading: heading.dark,
  separator: separator.dark,
  scrollHint: scrollHint.dark,
  skeletonItem: skeletonItem.dark,
};

export const settings: Mode = {
  globalItem: globalItem.settings,
  globalNav: globalNav.settings,
  contentNav: contentNav.settings,
  item: item.settings,
  heading: heading.settings,
  separator: separator.settings,
  scrollHint: scrollHint.settings,
  skeletonItem: skeletonItem.settings,
};
