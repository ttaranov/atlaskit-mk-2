// @flow

import React, { PureComponent, type ComponentType } from 'react';

type Props = { defaultIsOpen: boolean, isOpen?: boolean };
type State = { isOpen: boolean };

const manageState = (SelectComponent: ComponentType<*>) =>
  class StateManager extends PureComponent<Props, State> {
    static defaultProps = { defaultIsOpen: false };

    state = {
      isOpen:
        this.props.isOpen !== undefined
          ? this.props.isOpen
          : this.props.defaultIsOpen,
    };
    getProp(key: string) {
      return this.props[key] !== undefined ? this.props[key] : this.state[key];
    }
    callProp(name: string, ...args: any) {
      if (typeof this.props[name] !== 'function') return null;

      return this.props[name](...args);
    }
    onOpen = () => {
      this.callProp('onOpen');
      this.setState({ isOpen: true });
    };
    onClose = () => {
      this.callProp('onClose');
      this.setState({ isOpen: false });
    };
    render() {
      return (
        <SelectComponent
          {...this.props}
          isOpen={this.getProp('isOpen')}
          onClose={this.onClose}
          onOpen={this.onOpen}
        />
      );
    }
  };

export default manageState;
