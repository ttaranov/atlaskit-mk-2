// @flow

import { Container } from 'unstated';

import type {
  InitialUIControllerShape,
  UIControllerCache,
  UIControllerCacheGetter,
  UIControllerCacheSetter,
  UIControllerInterface,
  UIControllerShape,
} from './types';

import { CONTENT_NAV_WIDTH } from '../common/constants';

const defaultState = {
  isPeekHinting: false,
  isPeeking: false,
  isResizing: false,
  isResizeDisabled: false,
  isCollapsed: false,
  productNavWidth: CONTENT_NAV_WIDTH,
};

type Resize = {
  productNavWidth: number,
  isCollapsed: boolean,
};

export default class UIController extends Container<UIControllerShape>
  implements UIControllerInterface {
  getCache: ?UIControllerCacheGetter;
  setCache: ?UIControllerCacheSetter;

  constructor(
    initialState?: InitialUIControllerShape,
    cache: UIControllerCache | false,
  ) {
    super();

    let cachedState = {};
    if (cache) {
      const { get, set } = cache;
      cachedState = get();

      this.getCache = get;
      this.setCache = set;
    }

    const state = {
      ...defaultState,
      ...cachedState,
      ...initialState,
    };

    // isResizeDisabled takes precedence over isCollapsed
    const isCollapsed =
      initialState && initialState.isResizeDisabled ? false : state.isCollapsed;

    this.state = { ...state, isCollapsed };
  }

  storeState = (state: Object) => {
    this.setState(state);
    if (this.setCache) this.setCache(this.state);
  };

  // ==============================
  // UI
  // ==============================

  collapse = () => {
    if (this.state.isResizeDisabled) {
      return;
    }
    this.storeState({ isCollapsed: true });
  };
  expand = () => {
    if (this.state.isResizeDisabled) {
      return;
    }
    this.storeState({ isCollapsed: false });
  };
  toggleCollapse = () => {
    const toggle = this.state.isCollapsed ? this.expand : this.collapse;
    toggle();
  };

  manualResizeStart = ({ productNavWidth, isCollapsed }: Resize) => {
    if (this.state.isResizeDisabled) {
      return;
    }
    this.storeState({
      isResizing: true,
      productNavWidth,
      isCollapsed,
    });
  };
  manualResizeEnd = ({ productNavWidth, isCollapsed }: Resize) => {
    if (this.state.isResizeDisabled) {
      return;
    }
    this.storeState({
      isResizing: false,
      productNavWidth,
      isCollapsed,
    });
  };

  enableResize = () => {
    // This is a page-level setting not a user preference so we don't cache
    // this.
    this.setState({ isResizeDisabled: false });
  };
  disableResize = () => {
    // This is a page-level setting not a user preference so we don't cache
    // this.
    this.setState({ isResizeDisabled: true, isCollapsed: false });
  };

  peekHint = () => {
    this.storeState({ isPeekHinting: true });
  };
  unPeekHint = () => {
    this.storeState({ isPeekHinting: false });
  };
  togglePeekHint = () => {
    const toggle = this.state.isPeekHinting ? this.unPeekHint : this.peekHint;
    toggle();
  };

  peek = () => {
    this.storeState({ isPeeking: true });
  };
  unPeek = () => {
    this.storeState({ isPeeking: false });
  };
  togglePeek = () => {
    const toggle = this.state.isPeeking ? this.unPeek : this.peek;
    toggle();
  };
}
