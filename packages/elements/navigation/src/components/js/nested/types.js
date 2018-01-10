// @flow
export type ReactElement = any;

export type TraversalDirection = 'up' | 'down';

export type OnAnimationEnd = ({
  traversalDirection: TraversalDirection,
}) => void;

export type Stack = Array<any>;

export type ContainerNavigationNestedType = {
  /** Callback function which will be executed when the transition animation completes. */
  onAnimationEnd?: OnAnimationEnd,
  /**
   * An array of arrays representing the current state of the nested navigation.
   * The last item is rendered and the other items represent its ancestors in the menu tree.
   */
  stack: Stack,
};

export type ContainerNavigationNestedPageState = {
  isEntering: boolean,
  isLeaving: boolean,
};

export type ContainerNavigationNestedPageProps = {
  /** The items to display in this level of the menu */
  children?: ReactElement,
  /** Callback function which will be executed when the transition animation completes. */
  onAnimationEnd?: OnAnimationEnd,
  /** The direction in which we're traversing through the nested navigation ('up' or 'down'). */
  traversalDirection: TraversalDirection,
};
