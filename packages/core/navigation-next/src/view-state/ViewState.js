// @flow

import { Container } from 'unstated';

import type {
  ViewStateInterface,
  ViewStateProps,
  ViewStateState,
  ViewID,
  ViewLayer,
  ViewData,
  View,
  Reducer,
} from './types';

const stateKeys = {
  container: {
    id: 'containerViewId',
    data: 'containerViewData',
    incomingId: 'incomingContainerViewId',
  },
  product: {
    id: 'productViewId',
    data: 'productViewData',
    incomingId: 'incomingProductViewId',
  },
};
/**
 * Helper function for getting the keys in the state object for the active ID,
 * active data, and incoming ID for the given layer.
 */
const getStateKeysForLayer = (viewType: ViewLayer) => stateKeys[viewType];

const defaultProps: ViewStateProps = {
  isDebugEnabled: false,
};

export default class ViewState extends Container<ViewStateState>
  implements ViewStateInterface {
  state = {
    // Product layer
    productViewId: null,
    productViewData: null,
    incomingProductViewId: null,

    // Container layer
    containerViewId: null,
    containerViewData: null,
    incomingContainerViewId: null,

    // Product home view
    homeViewId: null,
  };

  reducers: { [ViewID]: Reducer[] } = {};
  views: { [ViewID]: View } = {};
  isDebugEnabled: boolean = false;

  constructor({ isDebugEnabled }: ViewStateProps = defaultProps) {
    super();
    this.isDebugEnabled = isDebugEnabled;
  }

  /**
   * Check whether the given view ID is currently active.
   */
  _viewIsActive = (viewId: ViewID) => {
    const { containerViewId, productViewId } = this.state;
    return viewId === containerViewId || viewId === productViewId;
  };

  /**
   * Helper function for reducing a view's data and updating the state.
   */
  _updateViewState = (view: View, initialData: ViewData) => {
    const reducers = this.reducers[view.id] || [];
    const reducedData = reducers.reduce(
      (d, reducer) => reducer(d),
      initialData,
    );

    const l = getStateKeysForLayer(view.type);

    this.setState({
      [l.id]: view.id,
      [l.data]: reducedData,
      [l.incomingId]: null,
    });

    // If we're setting a container view we reset the product view to the
    // default home view.
    const { homeViewId } = this.state;
    if (homeViewId && view.type === 'container' && view.id !== homeViewId) {
      this.setView(homeViewId);
    }
  };

  /**
   * Add a reducer to the view with the given ID.
   */
  addReducer = (viewId: ViewID, reducer: Reducer) => {
    const reducersForView = [...(this.reducers[viewId] || []), reducer];
    this.reducers = { ...this.reducers, [viewId]: reducersForView };

    // If we're adding a reducer to the active view we'll want to force an
    // update so that the reducer gets applied.
    this.updateActiveView(viewId);
  };

  /**
   * Remove a reducer from the view with the given ID.
   */
  removeReducer = (viewId: ViewID, reducer: Reducer) => {
    const reducersForView = this.reducers[viewId];
    if (!reducersForView) {
      return;
    }

    const newReducers = reducersForView.filter(r => r !== reducer);
    this.reducers = { ...this.reducers, [viewId]: newReducers };

    // If we're removing a reducer from the active view we'll want to force an
    // update so that the data gets re-evaluated.
    this.updateActiveView(viewId);
  };

  /**
   * Register a view. You must provide an `id`, the `type` of view ('product' or
   * 'container'), and a `getItems` function which should return either an array
   * of data, or a Promise which will resolve to an array of data.
   */
  addView = (view: View) => {
    const { id, type } = view;
    const { id: activeId, incomingId } = getStateKeysForLayer(type);

    this.views = { ...this.views, [id]: view };

    // We need to call setView again for the following cases:
    // 1. The added view matches the activeView (if it returns a Promise we want
    //    to temporarily enter a loading state while it resolves).
    // 2. The added view matches the expected incoming view and we want to
    //    resolve it.
    if (id === this.state[activeId] || id === this.state[incomingId]) {
      this.setView(id);
    }
  };

  /**
   * Un-register a view. If the view being removed is active it will remain so
   * until a different view is set.
   */
  removeView = (viewId: ViewID) => {
    delete this.views[viewId];
  };

  /**
   * Set the registered view with the given ID as the active view for its layer.
   */
  setView = (viewId: ViewID) => {
    const view = this.views[viewId];

    // The view has been added
    if (view) {
      const returnedItems = view.getItems();
      const { incomingId } = getStateKeysForLayer(view.type);

      // This view returned a Promise
      if (returnedItems instanceof Promise) {
        // Enter a temporary loading state
        this.setState({
          [incomingId]: view.id,
        });

        // Wait for the Promise to resolve
        returnedItems.then(data => {
          this._updateViewState(view, data);
        });
        return;
      }

      // The view returned data
      this._updateViewState(view, returnedItems);
      return;
    }

    // The view has not been added yet. We enter an indefinite loading state
    // until the view is added or another view is set. We don't know what layer
    // this view is in yet so we set the incoming view ID for both layers.
    this.setState({
      incomingContainerViewId: viewId,
      incomingProductViewId: viewId,
    });
  };

  /**
   * Remove the container layer.
   */
  clearContainerView = () => {
    this.setState({
      containerViewId: null,
      containerViewData: null,
      incomingContainerViewId: null,
    });
  };

  /**
   * Specify which view should be treated as the root 'home' view.
   */
  setHomeView = (viewId: ViewID) => {
    this.setState({ homeViewId: viewId });
  };

  /**
   * Will re-resolve the active view and re-reduce its data. Accepts an optional
   * view ID to only re-resolve if the given ID matches the active view.
   */
  updateActiveView = (maybeViewId?: ViewID) => {
    const { containerViewId, productViewId } = this.state;

    // If a view ID has been provided and it matches an active view, reset that
    // view.
    if (maybeViewId && this._viewIsActive(maybeViewId)) {
      this.setView(maybeViewId);
      return;
    }

    // If a view ID hasn't been provided reset the active container and product
    // views.
    if (!maybeViewId) {
      if (containerViewId) {
        this.setView(containerViewId);
      }
      if (productViewId) {
        this.setView(productViewId);
      }
    }
  };

  setIsDebugEnabled = (isDebugEnabled: boolean) => {
    this.isDebugEnabled = isDebugEnabled;
  };
}
