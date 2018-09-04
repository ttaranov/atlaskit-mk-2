// @flow

// TODO: @atlassian/navigation package is the only other package that uses chromatism (currently).
// We should update to chromatism@3.0.0 once @atlassian/navigation package is deprecated.
import chromatism from 'chromatism';

import globalItemStyles from '../components/GlobalItem/styles';
import globalNavStyles from '../components/GlobalNav/styles';
import contentNavStyles from '../components/ContentNavigation/styles';
import itemStyles from '../components/Item/styles';
import headingStyles from '../components/GroupHeading/styles';
import separatorStyles from '../components/Separator/styles';
import scrollHintStyles from '../components/ScrollableSectionInner/styles';
import skeletonItemStyles from '../components/SkeletonItem/styles';

import type { Mode, ContextColors } from './types';

type Args = {
  product: {
    background: string,
    text: string,
  },
};

const colorMatrix = [
  {
    // Dark
    when: ({ l }) => l < 20,
    accent1: { s: 0, l: 16 }, // hover
    accent2: { s: 0, l: 12 }, // selected
    accent3: { s: 0, l: 8 }, //  // active
  },
  {
    // bright and saturated
    when: ({ s, l }) => s > 65 && l > 30,
    accent1: { s: -16, l: 12 }, // hover
    accent2: { s: 0, l: -8 }, // selected
    accent3: { s: -16, l: 8 }, // active
  },
  {
    // bright and dull
    when: ({ s, l }) => s <= 20 && l > 90,
    accent1: { s: 0, l: -2 }, // hover
    accent2: { s: 0, l: -6 }, // selected
    accent3: { s: 0, l: -4 }, // active
  },
  {
    // pastel
    when: ({ s, l }) => s > 20 && s < 50 && l > 50,
    accent1: { s: 24, l: 2 }, // hover
    accent2: { s: 8, l: -12 }, // selected
    accent3: { s: 8, l: -4 }, // active
  },
  {
    // dull
    when: ({ s, l }) => s <= 20 && l <= 90,
    accent1: { s: 0, l: 4 }, // hover
    accent2: { s: 0, l: -8 }, // selected
    accent3: { s: 0, l: -4 }, // active
  },
];

const getStatesBackground = (parts, modifier) =>
  ['accent1', 'accent3', 'accent2'].reduce((acc, k) => {
    acc[k] = chromatism.convert({
      ...parts,
      s: parts.s + modifier[k].s,
      l: parts.l + modifier[k].l,
    }).hex;
    return acc;
  }, {});

const getContextColors = ({ background, text }): ContextColors => {
  const bgParts = chromatism.convert(background).hsl;
  const vs = bgParts.l < 30 && bgParts.s < 50 ? -1 : 1;
  const textAccent1 = chromatism.brightness(
    1 + vs * 6,
    chromatism.fade(4, background, text).hex[2],
  ).hex;
  const colorMod = colorMatrix.find(cm => cm.when(bgParts)) || {
    accent1: { s: 0, l: 8 }, // hover
    accent2: { s: 8, l: -6 }, // selected
    accent3: { s: 0, l: 4 }, // active
  };

  return {
    background: {
      default: background,
      ...getStatesBackground(bgParts, colorMod),
    },
    text: { default: text, accent1: textAccent1 },
  };
};

export default ({ product }: Args): Mode => {
  const modeColors = {
    product: getContextColors(product),
  };

  return {
    globalItem: globalItemStyles(modeColors),
    globalNav: globalNavStyles(modeColors),
    contentNav: contentNavStyles(modeColors),
    heading: headingStyles(modeColors),
    item: itemStyles(modeColors),
    scrollHint: scrollHintStyles(modeColors),
    separator: separatorStyles(modeColors),
    skeletonItem: skeletonItemStyles(modeColors),
  };
};
