// @flow

import React, { Component } from 'react';
import { Provider } from 'unstated';
import { UIController, ViewController } from '..';
import { CONTENT_NAV_WIDTH } from '../common/constants';
import type { UIControllerShape } from '../ui-controller/types';
import type { NavigationProviderProps } from './types';

const LS_KEY = 'ATLASKIT_NAVIGATION_UI_STATE';

const DEFAULT_UI_STATE = {
  isPeekHinting: false,
  isPeeking: false,
  isCollapsed: false,
  productNavWidth: CONTENT_NAV_WIDTH,
  isResizing: false,
  isResizeDisabled: false,
};

function defaultGetCache(): UIControllerShape {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(LS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_UI_STATE;
  }
  return DEFAULT_UI_STATE;
}

function defaultSetCache(state: UIControllerShape) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }
}

export default class NavigationProvider extends Component<
  NavigationProviderProps,
> {
  static defaultProps = {
    cache: {
      get: defaultGetCache,
      set: defaultSetCache,
    },
    initialPeekViewId: null,
    isDebugEnabled: false,
    isResizeDisabled: false,
  };
  uiState: UIController;
  viewController: ViewController;

  constructor(props: NavigationProviderProps) {
    super(props);

    const {
      cache,
      initialPeekViewId,
      initialUIController,
      isDebugEnabled,
      isResizeDisabled,
    } = props;
    this.uiState = new UIController(
      { ...initialUIController, isResizeDisabled },
      cache,
    );
    this.viewController = new ViewController({
      isDebugEnabled,
      initialPeekViewId,
    });
  }

  componentDidUpdate(prevProps: NavigationProviderProps) {
    const { viewController, uiState } = this;
    const { isDebugEnabled, isResizeDisabled } = this.props;
    if (isDebugEnabled !== prevProps.isDebugEnabled) {
      viewController.setIsDebugEnabled(!!isDebugEnabled);
    }
    if (isResizeDisabled !== prevProps.isResizeDisabled) {
      if (isResizeDisabled) {
        uiState.disableResize();
      } else {
        uiState.enableResize();
      }
    }
  }

  render() {
    const { children } = this.props;
    const { uiState, viewController } = this;

    return <Provider inject={[uiState, viewController]}>{children}</Provider>;
  }
}
