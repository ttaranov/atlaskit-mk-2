// @flow
import React, { type Node } from 'react';
import PortalBase from './PortalBase';

type Layer = 'default' | 'spotlight' | 'flag' | 'tooltip';

type ZIndexMap = { [Layer]: number };

const create = (): ZIndexMap => ({
  default: 1,
  spotlight: 100,
  flag: 200,
  tooltip: 300,
});

const add = (map: ZIndexMap, layer: Layer, offset: number) => ({
  ...map,
  [layer]: map[layer] + offset,
});

type Props = {
  /* Children to render in the React Portal. */
  children: Node,
  /* The layer to render the children into. */
  layer: Layer,
};

const { Provider, Consumer } = React.createContext(create());

// This is an opinionated Atlaskit wrapper on PortalBase

class Portal extends React.Component<Props> {
  static defaultProps = {
    layer: 'default',
  };

  render() {
    const { layer, children } = this.props;
    return (
      <Consumer>
        {zIndexMap => (
          <Provider value={add(zIndexMap, layer, 1)}>
            <PortalBase
              className={`atlaskit-portal-${layer}`}
              zIndex={zIndexMap[layer]}
            >
              {children}
            </PortalBase>
          </Provider>
        )}
      </Consumer>
    );
  }
}

export default Portal;
