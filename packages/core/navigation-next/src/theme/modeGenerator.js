// @flow

// TODO: @atlassian/navigation package is the only other package that uses chromatism (currently).
// We should update to chromatism@3.0.0 once @atlassian/navigation package is deprecated.
import chromatism from 'chromatism';
import { colors } from '@atlaskit/theme';

import { light } from './modes';
import type { ItemPresentationProps } from '../components/Item/types';
import type { Mode } from './types';

type Args = {
  background: string,
  text: string,
};

export default ({ background, text }: Args): Mode => {
  const backgroundColorActive = chromatism.brightness(10, background).hex;
  const backgroundColorSelected = chromatism.brightness(-20, background).hex;
  const backgroundColorHover = chromatism.brightness(-10, background).hex;
  return {
    globalItem: args => {
      return light.globalItem(args);
    },
    globalNav: () => {
      const styles = light.globalNav();
      return {
        ...styles,
        backgroundColor: background,
        color: text,
      };
    },
    productNav: () => {
      const { container, root } = light.productNav();
      return {
        container: {
          ...container,
          backgroundColor: background,
          color: text,
        },
        root: {
          ...root,
          backgroundColor: background,
          color: text,
        },
      };
    },
    item: ({
      isActive,
      isHover,
      isSelected,
      spacing,
    }: ItemPresentationProps) => {
      const { root } = light.item({
        isActive,
        isHover,
        isSelected,
        spacing,
      });
      const rootStyles = {
        ...root,
        itemBase: {
          ...root.itemBase,
          backgroundColor: (() => {
            if (isActive) return backgroundColorActive;
            if (isSelected) return backgroundColorSelected;
            if (isHover) return backgroundColorHover;
            return background;
          })(),
        },
        textWrapper: {
          ...root.textWrapper,
          color: text,
        },
        subTextWrapper: {
          ...root.subTextWrapper,
          color: brightness(20, text).hex,
        },
      };
      return { container: rootStyles, root: rootStyles };
    },
    sectionTitle: () => {
      const { root } = light.sectionTitle();
      const rootStyles = {
        ...root,
        titleBase: {
          ...root.titleBase,
          color: chromatism.brightness(20, text).hex,
        },
      };
      return { container: rootStyles, root: rootStyles };
    },
    sectionSeparator: () => {
      const { root } = light.sectionSeparator();
      const rootStyles = { ...root, backgroundColor: colors.N80A };
      return { container: rootStyles, root: rootStyles };
    },
    scrollHint: () => {
      const { root } = light.scrollHint();
      const rootStyles = {
        ...root,
        wrapper: {
          ...root.wrapper,
          '&::before': {
            ...root.wrapper['&::before'],
            backgroundColor: colors.N80A,
          },
        },
        inner: {
          ...root.inner,
          '&::before': {
            ...root.inner['&::before'],
            backgroundColor: background,
          },
        },
      };
      return { container: rootStyles, root: rootStyles };
    },
  };
};
