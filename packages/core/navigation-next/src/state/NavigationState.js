// @flow

import { Container } from 'unstated';

import type {
  InitialNavigationStateShape,
  NavigationStateCache,
  NavigationStateCacheGetter,
  NavigationStateCacheSetter,
  NavigationStateInterface,
  NavigationStateShape,
} from './types';

import { PRODUCT_NAV_WIDTH } from '../common/constants';

const defaultState = {
  isHinting: false,
  isPeeking: false,
  isResizing: false,
  productNavIsCollapsed: false,
  productNavWidth: PRODUCT_NAV_WIDTH,
};

type Resize = {
  productNavWidth: number,
  productNavIsCollapsed: boolean,
};

export default class NavigationState extends Container<NavigationStateShape>
  implements NavigationStateInterface {
  getCache: ?NavigationStateCacheGetter;
  setCache: ?NavigationStateCacheSetter;

  constructor(
    initialState?: InitialNavigationStateShape,
    cache: NavigationStateCache | false,
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

  collapseProductNav = () => {
    this.storeState({ productNavIsCollapsed: true });
  };
  expandProductNav = () => {
    this.storeState({ productNavIsCollapsed: false });
  };
  toggleProductNav = () => {
    const toggle = this.state.productNavIsCollapsed
      ? this.expandProductNav
      : this.collapseProductNav;
    toggle();
  };

  manualResizeStart = ({ productNavWidth, productNavIsCollapsed }: Resize) => {
    this.storeState({
      isResizing: true,
      productNavWidth,
      productNavIsCollapsed,
    });
  };
  manualResizeEnd = ({ productNavWidth, productNavIsCollapsed }: Resize) => {
    this.storeState({
      isResizing: false,
      productNavWidth,
      productNavIsCollapsed,
    });
  };

  hint = () => {
    this.storeState({ isHinting: true });
  };
  unHint = () => {
    this.storeState({ isHinting: false });
  };
  toggleHint = () => {
    const toggle = this.state.isHinting ? this.unHint : this.hint;
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
