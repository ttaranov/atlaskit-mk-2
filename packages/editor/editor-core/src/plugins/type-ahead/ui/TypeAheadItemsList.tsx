import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import Item, { ItemGroup, itemThemeNamespace } from '@atlaskit/item';
import { colors, themed } from '@atlaskit/theme';
import { TypeAheadItem } from '../types';

const itemTheme = {
  [itemThemeNamespace]: {
    padding: {
      default: {
        bottom: 12,
        left: 12,
        right: 12,
        top: 12,
      },
    },
    beforeItemSpacing: {
      default: () => 12,
    },
    borderRadius: () => 0,
    hover: {
      background: colors.transparent,
      text: colors.text,
      secondaryText: colors.N200,
    },
    selected: {
      background: themed({ light: colors.N20, dark: colors.DN70 }),
      text: themed({ light: colors.N800, dark: colors.DN600 }),
      secondaryText: themed({ light: colors.N200, dark: colors.DN300 }),
    },
  },
};

export type TypeAheadItemsListProps = {
  items?: Array<TypeAheadItem>;
  currentIndex: number;
  insertByIndex: (index: number) => void;
  setCurrentIndex: (index: number) => void;
};

export function scrollIntoViewIfNeeded(element: HTMLElement) {
  const { offsetTop, offsetHeight, offsetParent } = element;

  const {
    offsetHeight: offsetParentHeight,
    scrollTop,
  } = offsetParent as HTMLElement;

  const direction =
    offsetTop + offsetHeight > offsetParentHeight + scrollTop
      ? 1
      : scrollTop > offsetTop
        ? -1
        : 0;

  if (direction !== 0 && offsetParent) {
    offsetParent.scrollTop =
      direction === 1
        ? offsetTop + offsetHeight - offsetParentHeight
        : offsetTop;
  }
}

export function TypeAheadItemsList({
  items,
  currentIndex,
  insertByIndex,
  setCurrentIndex,
}: TypeAheadItemsListProps) {
  if (!Array.isArray(items)) {
    return null;
  }

  return (
    <ThemeProvider theme={itemTheme}>
      <ItemGroup>
        {items.map(
          (item, index) =>
            item.render ? (
              <div
                key={item.key ? item.key : item.title}
                ref={
                  index === currentIndex
                    ? ref => ref && scrollIntoViewIfNeeded(ref)
                    : () => null
                }
              >
                {item.render({
                  onClick: () => insertByIndex(index),
                  onMouseMove: () => setCurrentIndex(index),
                  isSelected: index === currentIndex,
                })}
              </div>
            ) : (
              <Item
                key={item.title}
                onClick={() => insertByIndex(index)}
                onMouseMove={() => setCurrentIndex(index)}
                elemBefore={item.icon ? item.icon() : null}
                isSelected={index === currentIndex}
                ref={
                  index === currentIndex
                    ? ref => ref && scrollIntoViewIfNeeded(ref.ref)
                    : null
                }
              >
                {item.title}
              </Item>
            ),
        )}
      </ItemGroup>
    </ThemeProvider>
  );
}
