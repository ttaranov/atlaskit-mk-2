// @flow

import React, { PureComponent } from 'react';
import { Provider } from 'unstated';
import NavigationState from './NavigationState';
import type { NavigationProviderProps, NavigationStateShape } from './types';

const LS_KEY = 'ATLASKIT_NAVIGATION_STATE';

function defaultGetCache() {
  const stored = localStorage.getItem(LS_KEY);
  return stored ? JSON.parse(stored) : {};
}

function defaultSetCache(state: NavigationStateShape) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

export default class NavigationProvider extends PureComponent<
  NavigationProviderProps,
> {
  static defaultProps = {
    cache: {
      get: defaultGetCache,
      set: defaultSetCache,
    },
  };

  render() {
    const { children, cache, initialState } = this.props;
    const state = new NavigationState(initialState, cache);

    return <Provider inject={[state]}>{children}</Provider>;
  }
}
