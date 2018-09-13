// @flow

import type { Node } from 'react';

export type InteractionState = {
  isActive: boolean,
  isHover: boolean,
  isClicked: boolean,
};

export type InteractionStateProps = {
  children: InteractionState => Node,
};
