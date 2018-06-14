// @flow
import React, { createContext, type Element } from 'react';
import NodeResolver from 'react-node-resolver';
import createFocusTrap from 'focus-trap';
import tabbable from 'tabbable';

type Trap = Object;

const createManager = () => {
  let traps: Trap[] = [];
  return {
    add(trap: Trap, enabled: boolean) {
      const [head, ...others] = traps;
      if (enabled) {
        if (head) {
          head.pause();
        }
        traps = [trap.activate(), ...traps];
      } else {
        traps = head ? [head, trap, ...others] : [trap];
      }
    },
    remove(trap: Trap) {
      const [head, next] = traps;
      trap.deactivate();
      if (trap === head && next) {
        next.unpause();
      }
      traps = traps.filter(t => t !== trap);
    },
    unpause(trap: Trap) {
      const [head] = traps;
      if (head && trap !== head) {
        head.pause();
      }
      traps = [trap, ...traps.filter(t => t !== trap)];
      trap.activate();
    },
    pause(trap: Trap) {
      const [head, next, ...others] = traps;
      trap.pause();
      if (trap === head && next) {
        next.activate();
        traps = [next, head, ...others];
      }
    },
  };
};

const { Consumer } = createContext(createManager());

type FocusTrapProps = {
  children: Element<any>,
  initialFocus?: string | (() => HTMLElement),
  enabled?: boolean,
};

class FocusTrap extends React.Component<FocusTrapProps & { manager: Object }> {
  static defaultProps = {
    enabled: false,
  };
  trap: Object = {};
  trapFocus = (wasEnabled: boolean, nowEnabled: boolean) => {
    const { manager } = this.props;
    if (wasEnabled && !nowEnabled) {
      manager.pause(this.trap);
    } else if (!wasEnabled && nowEnabled) {
      manager.unpause(this.trap);
    }
  };
  resolveNode = (elem: HTMLElement) => {
    const { initialFocus, enabled, manager } = this.props;
    if (elem) {
      const initialFocusElement = initialFocus || tabbable(elem)[0] || elem;
      this.trap = createFocusTrap(elem, {
        initialFocus: initialFocusElement,
        clickOutsideDeactivates: true,
        escapeDeactivates: false,
      });
      manager.add(this.trap, enabled);
    }
  };
  componentWillUnmount() {
    this.props.manager.remove(this.trap);
  }
  componentDidUpdate(prevProps: FocusTrapProps) {
    this.trapFocus(!!prevProps.enabled, !!this.props.enabled);
  }
  render() {
    const { children } = this.props;
    return <NodeResolver innerRef={this.resolveNode}>{children}</NodeResolver>;
  }
}

const FocusTrapConsumer = (props: FocusTrapProps) => (
  <Consumer>{manager => <FocusTrap {...props} manager={manager} />}</Consumer>
);

export default FocusTrapConsumer;
