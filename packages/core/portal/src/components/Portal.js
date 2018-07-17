// @flow
import React, { type Node } from 'react';
import ReactDOM from 'react-dom';

// This component does two things:
// 1. Portals it's children using React.createPortal
// 2. Manages the DOM nodes so each layer stacks correctly

type Layer = 'default' | 'spotlight' | 'flag' | 'tooltip';

type Props = {
  /* The layer to render the children into. */
  layer: Layer,
  /* Children to render in the React Portal. */
  children: Node,
  /* Given a layer return the DOM element to use as the container for the React Portal. */
  getLayer: Layer => ?HTMLElement,
  /*
    Given an array of layers return an Object of layer to DOM elements. These DOM elements
    will be used as the container for each React Portal.
  */
  createLayers: (Layer[]) => { [layer: Layer]: HTMLElement },
};

type State = {
  container: ?HTMLElement,
};

const atlaskitLayers: Layer[] = ['default', 'spotlight', 'flag', 'tooltip'];

const defaultGetLayer = (layer: Layer) =>
  document.querySelector(`body > div#${layer}`);

const defaultCreateLayers = (layers: Layer[]) => {
  const elems = {};
  layers.forEach((layer, i) => {
    const elem = document.createElement('div');
    elem.setAttribute('id', layer);
    elem.setAttribute('style', `z-index: ${i + 1}`);
    if (document.body) {
      document.body.appendChild(elem);
    }
    elems[layer] = elem;
  });
  return elems;
};

class Portal extends React.Component<Props, State> {
  static defaultProps = {
    layer: 'default',
    getLayer: defaultGetLayer,
    createLayers: defaultCreateLayers,
  };
  state = {
    container: undefined,
  };
  getContainer = () => {
    const { layer, getLayer, createLayers } = this.props;
    const container = getLayer(layer);
    if (!container) {
      const layers = createLayers(atlaskitLayers);
      return layers[layer];
    }
    return container;
  };
  componentDidUpdate(prevProps: Props) {
    if (prevProps.layer !== this.props.layer) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ container: this.getContainer() });
    }
  }
  componentDidMount() {
    if (!this.state.container) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ container: this.getContainer() });
    }
  }
  render() {
    const { children } = this.props;
    const { container } = this.state;
    return container ? ReactDOM.createPortal(children, container) : null;
  }
}

export default Portal;
