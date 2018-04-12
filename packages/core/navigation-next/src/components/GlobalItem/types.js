// @flow

import type { ComponentType, Node } from 'react';

import type { StyleReducer, Theme } from '../../theme/types';
import type { InteractionState } from '../InteractionStateManager';

type Size = 'large' | 'small';

export type PresentationProps = {
  isActive: boolean,
  isFirst: boolean,
  isHover: boolean,
  size: Size,
};

export type GlobalItemRenderComponentProps = {
  children: Node,
  className: string,
};

type GlobalItemIconProps = {
  label: string,
  secondaryColor: 'inherit',
  size: 'large' | null,
};

export type GlobalItemProps = {
  badge?: ComponentType<PresentationProps>,
  component?: ComponentType<GlobalItemRenderComponentProps>,
  href?: string,
  icon: ComponentType<GlobalItemIconProps>,
  isFirst?: boolean,
  label: string,
  onClick?: (SyntheticEvent<MouseEvent>) => void,
  size: Size,
  styles?: StyleReducer<PresentationProps>,
  /** Note: target will only be used if href is also set */
  target?: string,
  tooltip?: Node,
};

export type GlobalItemPrimitiveProps = GlobalItemProps &
  InteractionState & { theme: Theme };
