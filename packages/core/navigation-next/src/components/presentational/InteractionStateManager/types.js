// @flow

import type { Node } from 'react';

export type InteractionState = {
  isActive: boolean,
  isHover: boolean,
};

export type InteractionStateProps = {
  children: InteractionState => Node,
  styles?: {},
};
