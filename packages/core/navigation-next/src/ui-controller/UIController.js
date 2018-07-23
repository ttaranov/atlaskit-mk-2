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

    if (!cache) {
      this.state = Object.assign({}, defaultState, initialState);
      return;
    }

    const { get, set } = cache;
    const cachedState = get();

    this.getCache = get;
    this.setCache = set;
    this.state = Object.assign({}, defaultState, cachedState, initialState);
  }

  storeState = (state: Object) => {
    this.setState(state);
    if (this.setCache) this.setCache(this.state);
  };

  // ==============================
  // UI
  // ==============================

  collapse = () => {
    this.storeState({ isCollapsed: true });
  };
  expand = () => {
    this.storeState({ isCollapsed: false });
  };
  toggleCollapse = () => {
    const toggle = this.state.isCollapsed ? this.expand : this.collapse;
    toggle();
  };

  manualResizeStart = ({ productNavWidth, isCollapsed }: Resize) => {
    this.storeState({
      isResizing: true,
      productNavWidth,
      isCollapsed,
    });
  };
  manualResizeEnd = ({ productNavWidth, isCollapsed }: Resize) => {
    this.storeState({
      isResizing: false,
      productNavWidth,
      isCollapsed,
    });
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
