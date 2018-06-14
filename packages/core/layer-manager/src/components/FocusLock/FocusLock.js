// @flow
import React, { createContext, type Element } from 'react';
import NodeResolver from 'react-node-resolver';
import createFocusTrap from 'focus-trap';
import tabbable from 'tabbable';

const { Consumer, Provider } = createContext(() => {});

type FocusTrapProps = {
  children: Element<any>,
  initialFocus?: string | (() => HTMLElement),
  enabled?: boolean,
};

class FocusTrap extends React.Component<
  FocusTrapProps & { trapCreated: boolean => void },
> {
  static defaultProps = {
    enabled: false,
  };
  trap: Object = {};
  hasChildTrap = false;
  trapFocus = (wasEnabled: boolean, nowEnabled: boolean) => {
    if (wasEnabled && !nowEnabled) {
      this.trap.pause();
    } else if (!wasEnabled && nowEnabled) {
      this.trap.unpause();
    }
  };
  onTrapCreated = enabled => {
    this.hasChildTrap = enabled;
  };
  resolveNode = (elem: HTMLElement) => {
    const { initialFocus, enabled, trapCreated } = this.props;
    if (elem) {
      const initialFocusElement = initialFocus || tabbable(elem)[0] || elem;
      this.trap = createFocusTrap(elem, {
        initialFocus: initialFocusElement,
        clickOutsideDeactivates: true,
        escapeDeactivates: false,
      });
      trapCreated(enabled);
      if (!this.hasChildTrap && enabled) {
        this.trap.activate();
      }
    }
  };
  componentWillUnmount() {
    this.trap.deactivate();
  }
  componentDidUpdate(prevProps: FocusTrapProps) {
    this.trapFocus(!!prevProps.enabled, !!this.props.enabled);
  }
  render() {
    const { children } = this.props;
    return (
      <Provider value={this.onTrapCreated}>
        <NodeResolver innerRef={this.resolveNode}>{children}</NodeResolver>
      </Provider>
    );
  }
}

const FocusTrapConsumer = (props: FocusTrapProps) => (
  <Consumer>
    {trapCreated => <FocusTrap {...props} trapCreated={trapCreated} />}
  </Consumer>
);

export default FocusTrapConsumer;
