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

  const getBackgroundColorByState = ({ isActive, isSelected, isHover }) => {
    if (isActive) return backgroundColorActive;
    if (isSelected) return backgroundColorSelected;
    if (isHover) return backgroundColorHover;
    return background;
  };

  return {
    globalItem: args => {
      const styles = light.globalItem(args);

      const backgroundColor = getBackgroundColorByState(args);
      return {
        ...styles,
        itemBase: {
          ...styles.itemBase,
          backgroundColor,
          color: text,
          fill: backgroundColor,
        },
      };
    },
    globalNav: () => {
      const styles = light.globalNav();
      return {
        ...styles,
        backgroundColor: background,
        color: text,
      };
    },
    contentNav: () => {
      const { container, product } = light.contentNav();
      return {
        container: {
          ...container,
          backgroundColor: background,
          color: text,
        },
        product: {
          ...product,
          backgroundColor: background,
          color: text,
        },
      };
    },
    heading: () => {
      const { product } = light.heading();
      const productStyles = {
        ...product,
        titleBase: {
          ...product.titleBase,
          color: chromatism.brightness(20, text).hex,
        },
      };
      return { container: productStyles, product: productStyles };
    },
    item: ({
      isActive,
      isHover,
      isSelected,
      spacing,
    }: ItemPresentationProps) => {
      const { product } = light.item({
        isActive,
        isHover,
        isSelected,
        spacing,
      });
      const productStyles = {
        ...product,
        itemBase: {
          ...product.itemBase,
          backgroundColor: getBackgroundColorByState({
            isActive,
            isHover,
            isSelected,
          }),
        },
        textWrapper: {
          ...product.textWrapper,
          color: text,
        },
        subTextWrapper: {
          ...product.subTextWrapper,
          color: chromatism.brightness(20, text).hex,
        },
      };
      return { container: productStyles, product: productStyles };
    },
    scrollHint: () => {
      const { product } = light.scrollHint();
      const productStyles = {
        ...product,
        wrapper: {
          ...product.wrapper,
          '&::before': {
            ...product.wrapper['&::before'],
            backgroundColor: colors.N80A,
          },
        },
        inner: {
          ...product.inner,
          '&::before': {
            ...product.inner['&::before'],
            backgroundColor: background,
          },
        },
      };
      return { container: productStyles, product: productStyles };
    },
    separator: () => {
      const { product } = light.separator();
      const productStyles = { ...product, backgroundColor: colors.N80A };
      return { container: productStyles, product: productStyles };
    },
    skeletonItem: () => {
      const { product } = light.skeletonItem();
      const productStyles = {
        ...product,
        backgroundColor: chromatism.brightness(20, background).hex,
      };
      return { container: productStyles, product: productStyles };
    },
  };
};
