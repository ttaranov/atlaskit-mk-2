// @flow

import type { ItemPresentationProps } from '../Item/types';

import type { StyleReducer, ProductTheme } from '../../theme/types';

export type ItemAvatarProps = {
  itemState: ItemPresentationProps,
  /** Note: This function will be provided with the styles for an Item, because
   * ItemAvatar inherits its border color from Item's background color.  */
  styles: StyleReducer<ItemPresentationProps>,
  theme: ProductTheme,
};
