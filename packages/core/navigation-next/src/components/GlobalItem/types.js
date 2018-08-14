// @flow

import type { ComponentType, Node } from 'react';

import type { StyleReducer, GlobalTheme } from '../../theme/types';
import type { InteractionState } from '../InteractionStateManager/types';

type Size = 'large' | 'small';

export type GlobalItemPresentationProps = {
  /** Whether the Item is currently in the 'active' interaction state. */
  isActive: boolean,
  /** Whether the Item is currently in the 'hover' interaction state. */
  isHover: boolean,
  /** The size of the GlobalItem. */
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
  /** A component to render over the GlobalItem in the the badge position. */
  badge?: ComponentType<GlobalItemPresentationProps>,
  /** A custom component to render instead of the default wrapper component.
   * Could used to render a router Link, for example. The component will be
   * provided with a className and children, which should be passed on to the
   * element you render. */
  component?: ComponentType<GlobalItemRenderComponentProps>,
  /** An href which this Item links to. If this prop is provided the Item will
   * render as an <a>. */
  href?: string,
  /** A component which should render the main content of this GlobalItem. There
   * is an assumption that this will typically be an Atlaskit Icon component, so
   * it will be passed `label`, `secondaryColor`, and `size` props. */
  icon: ?ComponentType<GlobalItemIconProps>,
  /* The id of the item to be used in analytics and react keying */
  id?: string,
  /** The zero-based index for the position of the item within the global sidebar section.
   *  Used for analytics purposes.
   */
  index?: number,
  /** A label to pass to the `icon` component. */
  label?: string,
  /** A handler which will be called when the GlobalItem is clicked. */
  onClick?: (SyntheticEvent<HTMLElement>) => void,
  /** The size of the GlobalItem. */
  size?: Size,
  /** A function which will be passed the default styles object for the Item,
   * and should return a new styles object. Allows you to patch and customise
   * the GlobalItem's appearance. */
  styles?: StyleReducer,
  /** The HTML target attribute. Will only be used if href is also set. */
  target?: string,
  /** A string/Node to render in a tooltip which will appear when the GlobalItem
   * is hovered. */
  tooltip?: Node,
};

export type GlobalItemPrimitiveProps = GlobalItemProps &
  InteractionState & { theme: GlobalTheme };
