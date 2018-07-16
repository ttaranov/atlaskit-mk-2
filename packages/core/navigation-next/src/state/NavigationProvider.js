// @flow

import React, { Component } from 'react';
import { Provider } from 'unstated';
import { getContainerViewState, getRootViewState } from '../api';
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

export default class NavigationProvider extends Component<
  NavigationProviderProps,
> {
  static defaultProps = {
    cache: {
      get: defaultGetCache,
      set: defaultSetCache,
    },
    debug: false,
  };
  navState: NavigationState;

  constructor(props: NavigationProviderProps) {
    super(props);

    const { cache, initialState, debug } = props;
    this.navState = new NavigationState(initialState, cache);
    if (debug) {
      getContainerViewState().setDebug(debug);
      getRootViewState().setDebug(debug);
    }
  }

  componentWillReceiveProps(nextProps: NavigationProviderProps) {
    if (this.props.debug !== nextProps.debug) {
      getContainerViewState().setDebug(!!nextProps.debug);
      getRootViewState().setDebug(!!nextProps.debug);
    }
  }

  render() {
    const { children } = this.props;
    const { navState } = this;

    return <Provider inject={[navState]}>{children}</Provider>;
  }
}
