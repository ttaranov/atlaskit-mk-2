// @flow

import React, { PureComponent } from 'react';
import { Provider } from 'unstated';
import { AnalyticsContext } from '@atlaskit/analytics-next';

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import { NavAPI } from '../api';
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
    debug: false,
  };
  navState: NavigationState;
  navAPI: NavAPI;

  constructor(props: NavigationProviderProps) {
    super(props);

    const { cache, initialState, debug } = props;
    this.navState = new NavigationState(initialState, cache);
    this.navAPI = new NavAPI({ debug });
  }

  componentWillReceiveProps(nextProps: NavigationProviderProps) {
    if (this.props.debug !== nextProps.debug) {
      this.navAPI.setDebug(!!nextProps.debug);
    }
  }

  render() {
    const { children } = this.props;
    const { navState, navAPI } = this;
    const contextData = {
      componentName: 'navigationNext',
      packageName,
      packageVersion,
      source: 'navigationNext',
    };

    return (
      <Provider inject={[navState, navAPI]}>
        <AnalyticsContext data={contextData}>{children}</AnalyticsContext>
      </Provider>
    );
  }
}
