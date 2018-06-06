// @flow

import { resetContainerViewState, resetRootViewState } from '../api';

// A single function for resetting all singletons when SSR.
export const resetServerContext = () => {
  resetContainerViewState();
  resetRootViewState();
};
