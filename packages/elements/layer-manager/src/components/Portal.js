// @flow
import React, { Children, Component, type Node } from 'react';
import ReactDOM, { render, unmountComponentAtNode } from 'react-dom';
import { withTheme, ThemeProvider } from 'styled-components';
import { TransitionGroup } from 'react-transition-group';

type Props = {
  children: Node,
  theme: Object,
  withTransitionGroup: boolean,
};

const FirstChild = ({ children }) => Children.toArray(children)[0] || null;

const supportsReactPortals = typeof ReactDOM.createPortal === 'function';

class Portal extends Component<Props> {
  portalElement: HTMLElement;

  constructor(props) {
    super(props);
    this.portalElement = document.createElement('span');
  }

  componentWillMount() {
    if (document.body) {
      document.body.appendChild(this.portalElement);
    }
  }

  componentDidMount() {
    // mounting components in portals can have side effects (e.g. modals
    // applying scroll / focus locks). Because the unmounting of other portals
    // happens asynchronously, we wait for a moment before mounting new
    // portals to avoid race conditions in unmount handlers
    setTimeout(() => this.componentDidUpdate(), 1);
  }
  componentDidUpdate() {
    const { children } = this.props;
    if (this.portalElement && !supportsReactPortals) {
      const portal = this.portalElement;
      render(this.renderChildren(children), portal);
    }
  }
  componentWillUnmount() {
    if (supportsReactPortals) {
      document.body.removeChild(this.portalElement);
    } else if (this.portalElement && !supportsReactPortals) {
      // re-render an empty react tree into the portal element so that any
      // mounted components get cleaned up and have a chance to complete their
      // lifecycle before the portal is removed from the dom entirely
      const portal = this.portalElement;
      render(this.renderChildren(), portal, () => {
        // allow time for transitions to complete before the dom is cleaned up
        // five seconds is an arbitary number, but is more than any of our
        // animations need to complete
        setTimeout(() => {
          const target = document.body;
          if (!target) return;
          unmountComponentAtNode(portal);
          target.removeChild(portal);
        }, 5000);
      });
    }
  }
  renderChildren = children => {
    const { theme, withTransitionGroup } = this.props;
    return (
      <ThemeProvider theme={theme}>
        {withTransitionGroup ? (
          <TransitionGroup component={FirstChild}>{children}</TransitionGroup>
        ) : (
          children
        )}
      </ThemeProvider>
    );
  };
  render() {
    if (supportsReactPortals) {
      const children = this.renderChildren(this.props.children);
      return ReactDOM.createPortal(children, this.portalElement);
    }

    return null;
  }
}

// Pass theme through to be consumed
// TODO: @thejameskyle - Fix Styled Components for Flow 53+
const PortalWithTheme = (withTheme: any)(Portal);

// Wrap the default export in a ThemeProvider component so that withTheme
// doesn't freak out if the app doesn't have one already
export default function PortalWithThemeProvider(props: Object) {
  return (
    <ThemeProvider theme={{}}>
      <PortalWithTheme {...props} />
    </ThemeProvider>
  );
}
