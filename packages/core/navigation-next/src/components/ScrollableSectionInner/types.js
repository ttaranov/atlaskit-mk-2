// @flow

import type { Node } from 'react';

import type { Theme, StyleReducer } from '../../theme/types';

export type ScrollableSectionInnerProps = {
  children: Node,
  theme: Theme,
  styles: StyleReducer<void>,
};
