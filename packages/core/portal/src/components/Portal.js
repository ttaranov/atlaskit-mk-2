// @flow
import React, { type Node } from 'react';
import ReactDOM from 'react-dom';
import invariant from 'tiny-invariant';
import canUseDOM from '../utils/canUseDom';

type Props = {
  /* Children to render in the React Portal. */
  children: Node,
  /* The z-index of the DOM container element. */
  zIndex: number,
};

type State = {
  container: ?HTMLElement,
};

const createContainer = (zIndex: number) => {
  const container = document.createElement('div');
  container.setAttribute('class', 'atlaskit-portal');
  container.setAttribute(
    'style',
    `z-index: ${zIndex}; position: absolute; top: 0; left: 0; width: 100%;`,
  );
  return container;
};

const body = () => {
  invariant(document && document.body, 'cannot find document.body');
  return document.body;
};

// This is a generic component does two things:
// 1. Portals it's children using React.createPortal
// 2. Creates the DOM node container for the portal based on props
// 3. Ensures DOM the container creates it's own stacking context

class Portal extends React.Component<Props, State> {
  static defaultProps = {
    zIndex: 0,
  };

  state = {
    container: canUseDOM() ? createContainer(this.props.zIndex) : undefined,
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { container } = this.state;
    const { zIndex } = this.props;
    if (container && prevProps.zIndex !== zIndex) {
      const newContainer = createContainer(zIndex);

      body().replaceChild(container, newContainer);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ container: newContainer });
    } else if (!prevState.container && container) {
      // SSR path
      body().appendChild(container);
    }
  }
  componentDidMount() {
    const { container } = this.state;
    const { zIndex } = this.props;
    if (container) {
      body().appendChild(container);
    } else {
      // SSR path
      const newContainer = createContainer(zIndex);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ container: newContainer });
    }
  }
  componentWillUnmount() {
    const { container } = this.state;
    if (container) {
      body().removeChild(container);
    }
  }
  render() {
    const { container } = this.state;
    return container
      ? ReactDOM.createPortal(this.props.children, container)
      : this.props.children;
  }
}

export default Portal;
