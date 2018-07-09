// @flow
import React, { type Node } from 'react';
import ReactDOM from 'react-dom';

// this component does two things:
// 1. Portals it's children using React.createPortal
// 2. Manages the stacking context so that floating components are visible correctly

type Layer = 'default' | 'tooltip';

type Props = {
  layer: Layer,
  children: Node,
  getLayer: Layer => ?HTMLElement,
  createLayers: (Layer[]) => { [layer: Layer]: HTMLElement },
};

type State = {
  container: ?HTMLElement,
};

const atlaskitLayers: Layer[] = ['default', 'tooltip'];

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
