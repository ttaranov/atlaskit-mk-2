// @flow
import React, { type Node } from 'react';
import ReactDOM from 'react-dom';

type Props = {
  /* Children to render in the React Portal. */
  children: Node,
  /* The class name of the DOM container element. */
  className: string,
  /* The z-index of the DOM container element. */
  zIndex: number,
};

type State = {
  container: ?HTMLElement,
};

const createContainer = (className: string, zIndex: number) => {
  const container = document.createElement('div');
  container.setAttribute('class', className);
  container.setAttribute('style', `z-index: ${zIndex};`);
  return container;
};

const canUseDOM = () =>
  Boolean(
    typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement,
  );

// This is a generic component does two things:
// 1. Portals it's children using React.createPortal
// 2. Creates the DOM node container for the portal based on props

class PortalBase extends React.Component<Props, State> {
  state = {
    container: canUseDOM()
      ? createContainer(this.props.className, this.props.zIndex)
      : undefined,
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { container } = this.state;
    const { className, zIndex } = this.props;
    if (
      container &&
      (prevProps.className !== className || prevProps.zIndex !== zIndex)
    ) {
      const newContainer = createContainer(className, zIndex);
      document.body.replaceChild(container, newContainer);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ container: newContainer });
    } else if (!prevState.container && container) {
      document.body.appendChild(container);
    }
  }
  componentDidMount() {
    const { container } = this.state;
    const { className, zIndex } = this.props;
    if (container) {
      document.body.appendChild(container);
    } else {
      const newContainer = createContainer(className, zIndex);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ container: newContainer });
    }
  }
  componentWillUnmount() {
    const { container } = this.state;
    if (container) {
      document.body.removeChild(container);
    }
  }
  render() {
    const { container } = this.state;
    return container
      ? ReactDOM.createPortal(this.props.children, container)
      : null;
  }
}

export default PortalBase;
