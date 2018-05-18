// @flow

import type { ComponentType, Node } from 'react';

import type { StyleReducer, GlobalTheme } from '../../theme/types';
import type { InteractionState } from '../InteractionStateManager/types';

type Size = 'large' | 'small';

export type GlobalItemPresentationProps = {
  isActive: boolean,
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
  badge?: ComponentType<GlobalItemPresentationProps>,
  component?: ComponentType<GlobalItemRenderComponentProps>,
  href?: string,
  icon: ComponentType<GlobalItemIconProps>,
  label: string,
  onClick?: (SyntheticEvent<MouseEvent>) => void,
  size: Size,
  styles?: StyleReducer<GlobalItemPresentationProps>,
  /** Note: target will only be used if href is also set */
  target?: string,
  tooltip?: Node,
};

export type GlobalItemPrimitiveProps = GlobalItemProps &
  InteractionState & { theme: GlobalTheme };
