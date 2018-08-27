// @flow
import React, { createContext, type Node } from 'react';

type Props = {
  children: Node,
};

type State = {
  useChildrenFromProps: boolean,
  currentChildren: Node,
};

const { Consumer, Provider } = createContext({
  isOpen: true,
  onExited: undefined,
});

class ModalTransition extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    const { useChildrenFromProps, currentChildren } = state;
    const exiting = Boolean(currentChildren) && !props.children;
    return {
      currentChildren:
        exiting && !useChildrenFromProps ? currentChildren : props.children,
      useChildrenFromProps: false,
    };
  }
  state = {
    useChildrenFromProps: false,
    currentChildren: undefined,
  };
  onExited = () => {
    this.setState({
      currentChildren: this.props.children,
      useChildrenFromProps: true,
    });
  };
  render() {
    return (
      <Provider
        value={{
          onExited: this.onExited,
          isOpen: Boolean(this.props.children),
        }}
      >
        {this.state.currentChildren}
      </Provider>
    );
  }
}

export const ModalTransitionConsumer = Consumer;

export default ModalTransition;
