// @flow

import type { ComponentType, Node } from 'react';

import type { StyleReducer, ProductTheme } from '../../theme/types';
import type { InteractionState } from '../InteractionStateManager/types';

type Spacing = 'compact' | 'default';

export type ItemPresentationProps = {
  isActive: boolean,
  isHover: boolean,
  isSelected: boolean,
  spacing: Spacing,
};

export type ItemRenderComponentProps = {
  children: Node,
  className: string,
};

export type ItemProps = {
  after?: ComponentType<ItemPresentationProps>,
  before?: ComponentType<ItemPresentationProps>,
  component?: ComponentType<ItemRenderComponentProps>,
  href?: string,
  isSelected: boolean,
  onClick?: (SyntheticEvent<MouseEvent>) => void,
  spacing: Spacing,
  styles: StyleReducer<ItemPresentationProps>,
  subText?: string,
  /** Note: target will only be used if href is also set */
  target?: string,
  text: Node,
};

export type ItemPrimitiveProps = ItemProps &
  InteractionState & { theme: ProductTheme };
