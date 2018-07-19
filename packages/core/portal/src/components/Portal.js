// @flow
import React, { type Node } from 'react';
import ReactDOM from 'react-dom';

// This component does two things:
// 1. Portals it's children using React.createPortal
// 2. Creates a DOM node so each layer stacks correctly

type Layer = 'default' | 'spotlight' | 'flag' | 'tooltip';

type Props = {
  /* The layer to render the children into. */
  layer: Layer,
  /* Children to render in the React Portal. */
  children: Node,
};

type State = {
  container: ?HTMLElement,
};

const atlaskitLayers: Layer[] = ['default', 'spotlight', 'flag', 'tooltip'];

const createContainer = (layer: Layer) => {
  const container = document.createElement('div');
  container.setAttribute('class', `atlaskit-portal-${layer}`);
  container.setAttribute(
    'style',
    `z-index: ${atlaskitLayers.indexOf(layer) + 1};`,
  );
  return container;
};

const canUseDOM = () =>
  !!(
    typeof global.window !== 'undefined' &&
    global.window.document &&
    global.window.document.createElement
  );

class Portal extends React.Component<Props, State> {
  static defaultProps = {
    layer: 'default',
  };

  state = {
    container: canUseDOM() ? createContainer(this.props.layer) : undefined,
  };

  componentDidUpdate(prevProps: Props) {
    const { container } = this.state;
    const { layer } = this.props;
    if (container && prevProps.layer !== layer) {
      const newContainer = createContainer(layer);
      document.body.replaceChild(container, newContainer);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ container: newContainer });
    }
  }
  componentDidMount() {
    const { container } = this.state;
    if (container) {
      document.body.appendChild(container);
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

export default Portal;
