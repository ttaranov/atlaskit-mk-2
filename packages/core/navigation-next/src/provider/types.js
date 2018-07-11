// @flow

import type { Element } from 'react';

import type { InitialUIStateShape, UIStateCache } from '../ui-state/types';

/**
 * NavigationProvider
 */
export type NavigationProviderProps = {
  children: Element<*>,
  cache: UIStateCache | false,
  initialState?: InitialUIStateShape,
  isDebugEnabled?: boolean,
};
