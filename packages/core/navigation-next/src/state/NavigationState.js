// @flow

import { type ElementRef } from 'react';
import { Container } from 'unstated';

export type InitialState = {
  activeDrawer?: string | null,
  isPeeking?: boolean,
  productNavIsCollapsed?: boolean,
  productNavWidth?: number,
};
export type State = InitialState & { isResizing?: boolean };

type GetFn = () => State;
type SetFn = State => void;
export type Cache = { get: GetFn, set: SetFn };

const defaultState = {
  activeDrawer: null,
  isPeeking: false,
  isResizing: false,
  productNavIsCollapsed: false,
  productNavWidth: 270,
};

export default class NavigationState extends Container<State> {
  drawerGateway: HTMLElement;
  getCache: ?GetFn;
  setCache: ?SetFn;

  constructor(initialState?: InitialState, cache: Cache | false) {
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

  resizeProductNav = (width: any) => {
    const productNavWidth = width > 0 ? width : 0;
    this.setState({ productNavWidth });
  };

  collapseProductNav = () => {
    this.storeState({ productNavIsCollapsed: true });
  };
  expandProductNav = () => {
    this.storeState({ productNavIsCollapsed: false });
  };

  manualResizeStart = () => {
    this.storeState({ isResizing: true });
  };
  manualResizeEnd = () => {
    this.storeState({ isResizing: false });
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
}

export interface NavigationType {
  state: State;

  collapseProductNav: () => void;
  expandProductNav: () => void;

  peek: () => void;
  unPeek: () => void;
  togglePeek: () => void;

  openDrawer: (key: string) => void;
  closeActiveDrawer: () => void;

  openCreateDrawer: () => void;
  closeCreateDrawer: () => void;

  openSearchDrawer: () => void;
  closeSearchDrawer: () => void;
}
