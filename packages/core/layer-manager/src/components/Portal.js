// @flow
import React, { Children, Component, type Node } from 'react';
import { createPortal } from 'react-dom';
import { withTheme, ThemeProvider } from 'styled-components';
import { TransitionGroup } from 'react-transition-group';

type Props = {
  children: Node,
  theme: Object,
  withTransitionGroup: boolean,
};

type State = {
  mounted: boolean,
};

const FirstChild = ({ children }) => Children.toArray(children)[0] || null;

class Portal extends Component<Props, State> {
  portalElement = null;
  mountTimeout = null;
  state = {
    mounted: false,
  };
  componentDidMount() {
    const node = document.createElement('span');
    if (document.body) {
      document.body.appendChild(node);
      this.portalElement = node;
      // mounting components in portals can have side effects (e.g. modals
      // applying scroll / focus locks). Because the unmounting of other portals
      // happens asynchronously, we wait for a moment before mounting new
      // portals to avoid race conditions in unmount handlers
      this.mountTimeout = setTimeout(() => this.setState({ mounted: true }), 1);
    }
  }
  renderChildren = () => {
    const { children, theme, withTransitionGroup } = this.props;

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
    const { portalElement } = this;
    const { mounted } = this.state;
    if (mounted && portalElement) {
      return createPortal(this.renderChildren(), portalElement);
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
