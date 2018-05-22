// @flow

import { type ElementRef } from 'react';
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
  activeDrawer: null,
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
  drawerGateway: HTMLElement;
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

  // ==============================
  // DRAWERS
  // ==============================

  getDrawerGateway = (ref: ElementRef<*>) => {
    // HACK
    // trigger a re-render when the gateway ref is first resolved to
    // ensure any active drawers are shown immediately to the user.
    if (ref !== this.drawerGateway && this.state.activeDrawer) this.setState();
    this.drawerGateway = ref;
  };

  openDrawer = (key: string) => {
    this.storeState({ activeDrawer: key });
  };

  closeActiveDrawer = () => {
    this.storeState({ activeDrawer: null });
  };

  openCreateDrawer = () => {
    this.openDrawer('create');
  };
  closeCreateDrawer = () => {
    this.closeActiveDrawer();
  };

  openSearchDrawer = () => {
    this.openDrawer('search');
  };
  closeSearchDrawer = () => {
    this.closeActiveDrawer();
  };

  openNotificationDrawer = () => {
    this.openDrawer('notification');
  };
  closeNotificationDrawer = () => {
    this.closeActiveDrawer();
  };

  openPeopleDrawer = () => {
    this.openDrawer('people');
  };
  closePeopleDrawer = () => {
    this.closeActiveDrawer();
  };
}
