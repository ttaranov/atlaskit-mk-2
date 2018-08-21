// @flow

import React from 'react';
import { code, md, Props } from '@atlaskit/docs';

import { Contents, ContentsProvider, H, Hr } from './shared';

export default (
  <ContentsProvider>{md`${<Contents />}

${<Hr />}

${<H>NavigationProvider</H>}

The \`NavigationProvider\` facilitates sharing state throughout the application using Context. It should wrap the root of your application, and the \`LayoutManager\` component will not work unless it's the descendant of a \`NavigationProvider\`.

${(
    <Props
      heading="NavigationProvider props"
      props={require('!!extract-react-types-loader!../src/provider/NavigationProvider')}
    />
  )}

${<Hr />}

${<H>UI controller</H>}

The UI controller manages the visual state of the navigation component. To see this feature in action, [check out this guide](/packages/core/navigation-next/docs/composing-your-navigation#managing-the-ui-state).

### UIController

 The UIController class is the container for the UI state. It has the following interface:

${code`interface UIControllerInterface {
  state: {
    /** Whether the navigation is currently collapsed. */
    isCollapsed: boolean,
    /** Whether the navigation is currently performing a 'peek hint'.
     * @deprecated: The concept of peeking has been removed from the UX spec so
     * this property will be removed in a future release. */
    isPeekHinting: boolean,
    /** Whether the navigation is currently performing a 'peek'. @deprecated:
     * The concept of peeking has been removed from the UX spec so this property
     * will be removed in a future release. */
    isPeeking: boolean,
    /** Whether the navigation is currently being resized. */
    isResizing: boolean,
    /** The width of the content navigation area. */
    productNavWidth: number,
  };

  /** Collapsed the content navigation. */
  collapse: () => void;
  /** Expand the content navigation. */
  expand: () => void;
  /** Toggle the collapse/expand state of the content navigation. */
  toggleCollapse: () => void;

  /** Shift the container navigation layer to suggest that a 'peek' can be
   * performed. @deprecated */
  peekHint: () => void;
  /** Reset the position of the container navigation layer. @deprecated */
  unPeekHint: () => void;
  /** Toggle the hinting state of the container navigation layer. @deprecated */
  togglePeekHint: () => void;

  /** Slide the container navigation layer out of the way, or transition a
   * nested product navigation view, to reveal the 'root product home view'.
   * @deprecated */
  peek: () => void;
  /** Reset the navigation to its state before a peek was performed. @deprecated
   * */
  unPeek: () => void;
  /** Toggle the peeking state of the navigation. @deprecated */
  togglePeek: () => void;
}`}

### UIControllerSubscriber

A render component which provides the UI controller instance to its children.

${code`import { UIControllerSubscriber } from '@atlaskit/navigation-next';

const MyComponent = () => (
  <UIControllerSubscriber>
    {uiController => (
      <button onClick={uiController.toggleCollapse}>Click me</button>
    )}
  </UIControllerSubscriber>
);`}

### withNavigationUI

A higher-order component which provides the UI controller instance through the \`navigationUIController\` prop to the component it wraps.

${code`import { withNavigationUI } from '@atlaskit/navigation-next';

class MyComponentBase extends Component {
  render() {
    const { navigationUIController } = this.props;
    return navigationUIController.state.isCollapsed ? 'Foo' : 'Bar';
  }
}
const MyComponent = withNavigationUI(MyComponentBase);`}

${<Hr />}

${<H>View controller</H>}

The view controller manages which set of items should be rendered in the navigation. For an in-depth walk-through of how to use this feature, [check out this guide](/packages/core/navigation-next/docs/controlling-navigation-views).

### ViewController

The ViewController class is the container for the view state. It has the following interface:

${code`interface ViewControllerInterface {
  state: {
    /** The view which is currently being rendered in the navigation. */
    activeView: {
      /** The unique ID for this view. */
      id: string,
      /** The layer of navigation this view should be rendered on. */
      type: 'container' | 'product',
      /** An array of items. */
      data: [],
    } | null,

    /** The view which will become active once it has loaded. */
    incomingView: {
      /** The unique ID for this view. */
      id: string,
      /** The layer of navigation this view should be rendered on. */
      type: 'container' | 'product',
    } | null,

    /** The view which should be rendered on the product navigation layer when
     * the active view is a 'container' view. @deprecated: The concept of
     * peeking no longer exists in the UX spec, so this feature will be removed
     * in a future release. */
    activePeekView: {
      /** The unique ID for this view. */
      id: string,
      /** The layer of navigation this view should be rendered on. */
      type: 'container' | 'product',
      /** An array of items. */
      data: [],
    } | null,
  
    /** The view which will become the active peek view once it has loaded.
     * @deprecated */
    incomingPeekView: {
      /** The unique ID for this view. */
      id: string,
      /** The layer of navigation this view should be rendered on. */
      type: 'container' | 'product',
    } | null,
  };

  /** Register a view. You must provide an \`id\`, the \`type\` of view
   * ('product' or 'container'), and a \`getItems\` function which should return
   * either an array of data, or a Promise which will resolve to an array of
   * data. */
  addView: ({
    /** A unique ID for this view. */
    id: string,
    /** The layer of navigation this view should be rendered on. */
    type: 'container' | 'product',
    /** A function which should return an array of items, or a Promise which
     * will resolve to an array of items. */
    getItems: () => Promise<[]> | [],
  }) => void;

  /** Un-register a view. If the view being removed is active it will remain so
   * until a different view is set. */
  removeView: string => void;

  /** Set the registered view with the given ID as the active view. */
  setView: string => void;

  /** Add a reducer to the view with the given ID. */
  addReducer: (string, ([]) => []) => void;

  /** Remove a reducer from the view with the given ID. */
  removeReducer: (string, ([]) => []) => void;

  /** Specify which view should be treated as the initial peek view. */
  setInitialPeekViewId: string => void;

  /** Will re-resolve the active view and re-reduce its data. Accepts an
   * optional view ID to only re-resolve if the given ID matches the active
   * view. */
  updateActiveView: (string | void) => void;

  /** Set whether the view controller is in debug mode. */
  setIsDebugEnabled: boolean => void;
}`}

### ViewControllerSubscriber

A render component which provides the view controller instance to its children.

${code`import { ViewControllerSubscriber } from '@atlaskit/navigation-next';

const MyComponent = () => (
  <ViewControllerSubscriber>
    {viewController => (
      <button onClick={() => viewController.setView('view-id')}>
        Click me
      </button>
    )}
  </ViewControllerSubscriber>
);`}

### withNavigationViewController

A higher-order component which provides the view controller instance through the \`navigationViewController\` prop to the component it wraps.

${code`import { withNavigationViewController } from '@atlaskit/navigation-next';

class MyComponentBase extends Component {
  render() {
    const { navigationViewController } = this.props;
    navigationViewController.setView('view-id');
  }

  render() {
    return null;
  }
}
const MyComponent = withNavigationViewController(MyComponentBase);`}

${<Hr />}

${<H>Reducer utility functions</H>}

Stuff
`}</ContentsProvider>
);
