// @flow

import React, { type Node } from 'react';
import { Container, Subscribe } from 'unstated';
import { Item, Section, SectionSeparator, SectionTitle } from '../';

import type {
  NavAPIOptions,
  NavAPIState,
  Reducer,
  ViewData,
  ViewKey,
  ViewResolver,
} from './types';

const defaultOptions: NavAPIOptions = {
  activeView: null,
  reducers: {},
  views: {},
};

export class NavAPI extends Container<NavAPIState> {
  componentTypes = {
    Item,
    Section,
    SectionSeparator,
    SectionTitle,
  };

  reducers: { [ViewKey]: Reducer[] } = {};
  views: { [ViewKey]: ViewResolver } = {};

  constructor(options: NavAPIOptions | void) {
    super();
    const { activeView, reducers, views } = {
      ...defaultOptions,
      ...options,
    };

    // Initialise state
    this.state = {
      activeView,
      data: null,
      isLoading: !activeView,
      nextView: null,
    };

    this.reducers = reducers;
    this.views = views;

    // Resolve the active view data if we have an activeView.
    if (activeView) {
      this.setView(activeView);
    }
  }

  /**
   * Setters
   */
  addReducer = (viewKey: ViewKey, reducer: Reducer) => {
    const reducerList = [...(this.reducers[viewKey] || []), reducer];
    const newReducers = { ...this.reducers, [viewKey]: reducerList };
    this.reducers = newReducers;

    // If we're adding a reducer to the active view we'll want to re-set it so
    // that the reducer gets applied.
    const { activeView } = this.state;
    if (activeView && viewKey === activeView) {
      this.setView(activeView);
    }
  };

  addView = (viewKey: ViewKey, viewGetter: ViewResolver) => {
    const { activeView, nextView } = this.state;

    // Add the new view to the views map.
    const newViews = { ...this.views, [viewKey]: viewGetter };

    this.views = newViews;

    // We need to call setView again for the following cases:
    // 1. The added view matches the activeView (if it returns a Promise we
    //    want to temporarily enter a loading state while it resolves).
    // 2. The added view matches the expected nextView and we want to
    //    resolve it.
    if (viewKey === activeView || viewKey === nextView) {
      this.setView(viewKey);
    }
  };

  setView = (viewKey: ViewKey) => {
    const viewGetter = this.views[viewKey];

    // This view has already been added.
    if (viewGetter) {
      const view = viewGetter();

      // This view returned a Promise.
      if (view instanceof Promise) {
        // Enter a temporary loading state.
        this.setState({ isLoading: true, nextView: viewKey });

        // Wait for the promise to resolve.
        view.then(viewData => {
          this.setViewData(viewKey, viewData);
        });
        return;
      }

      // This view returned an Object.
      this.setViewData(viewKey, view);
      return;
    }

    // This view has not been added yet. We enter an indefinite loading
    // state until the view is added or another view is set.
    this.setState({ isLoading: true, nextView: viewKey });
  };

  setViewData = (viewKey: ViewKey, viewData: ViewData) => {
    // Pass the data through any reducers.
    const reducers = this.reducers[viewKey] || [];
    const data = reducers.reduce(
      (currentView, reducer) => reducer(currentView, viewKey),
      viewData,
    );

    this.setState({
      activeView: viewKey,
      data,
      isLoading: false,
      nextView: null,
    });
  };
}

type NavAPISubscriberProps = {| children: NavAPI => Node |};
export const NavAPISubscriber = ({ children }: NavAPISubscriberProps) => (
  <Subscribe to={[NavAPI]}>{children}</Subscribe>
);
