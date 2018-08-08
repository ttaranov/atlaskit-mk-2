import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { AppProxyReactContext } from './app';
import { Store } from 'redux';
import { State } from '../domain';

export interface PassContextProps {
  store: Store<State>;
  proxyReactContext?: AppProxyReactContext;
}
export default class PassContext extends Component<PassContextProps, any> {
  // We need to manually specify all the child contexts
  static childContextTypes = {
    store() {},
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
  };

  getChildContext() {
    const { store, proxyReactContext } = this.props;

    const getAtlaskitAnalyticsEventHandlers =
      proxyReactContext && proxyReactContext.getAtlaskitAnalyticsEventHandlers
        ? proxyReactContext.getAtlaskitAnalyticsEventHandlers
        : () => [];
    return {
      store,
      getAtlaskitAnalyticsEventHandlers,
    };
  }

  render(): any {
    const { children } = this.props;

    return children;
  }
}
