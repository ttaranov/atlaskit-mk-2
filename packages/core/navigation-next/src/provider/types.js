// @flow

import type { Element } from 'react';

import type {
  InitialUIControllerShape,
  UIControllerCache,
} from '../ui-controller/types';

/**
 * NavigationProvider
 */
export type NavigationProviderProps = {
  children: Element<*>,
  cache: UIControllerCache | false,
  initialPeekViewId: ?string,
  initialUIController?: InitialUIControllerShape,
  isDebugEnabled: boolean,
};
