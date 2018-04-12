// @flow

import type { ComponentType, Node } from 'react';

import type { StyleReducer, Theme } from '../../theme/types';
import type { InteractionState } from '../InteractionStateManager';

type Spacing = 'compact' | 'default';

export type PresentationProps = {
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
  after?: ComponentType<PresentationProps>,
  before?: ComponentType<PresentationProps>,
  component?: ComponentType<ItemRenderComponentProps>,
  href?: string,
  isSelected: boolean,
  onClick?: (SyntheticEvent<MouseEvent>) => void,
  spacing: Spacing,
  styles: StyleReducer<PresentationProps>,
  subText?: string,
  /** Note: target will only be used if href is also set */
  target?: string,
  text: Node,
};

export type ItemPrimitiveProps = ItemProps &
  InteractionState & { theme: Theme };
