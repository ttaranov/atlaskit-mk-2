// @flow
export type ReactElement = any;

export type TraversalDirection = 'up' | 'down';
export type OnAnimationEnd = ({|
  traversalDirection: TraversalDirection,
|}) => void;
export type Stack = Array<any>;

export type ContainerNestedNavigationPageState = {|
  isEntering: boolean,
  isLeaving: boolean,
|};
