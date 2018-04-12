// @flow

import React, { Component, type Element } from 'react';
import { Provider } from 'unstated';
import NavigationState, {
  type Cache,
  type InitialState,
  type State,
} from './NavigationState';

type ProviderProps = {
  children: Element<*>,
  cache: Cache | false,
  initialState?: InitialState,
};

const LS_KEY = 'ATLASKIT_NAVIGATION_STATE';
function defaultGetCache() {
  const stored = localStorage.getItem(LS_KEY);
  return stored ? JSON.parse(stored) : {};
}
function defaultSetCache(state: State) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

export default class NavigationProvider extends Component<ProviderProps> {
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
