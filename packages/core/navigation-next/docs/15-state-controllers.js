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

### UIController

The UI controller manages the visual state of the navigation component. It has the following interface:

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
`}</ContentsProvider>
);
