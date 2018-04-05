// @flow
import React, { Children, Component, type ElementRef } from 'react';
import NodeResolver from 'react-node-resolver';

import type { ElementType } from '../types';
import { withSpotlightState } from './SpotlightManager';
import { type RegistryType } from './SpotlightRegistry';

type Props = {
  /** a single child */
  children: ElementType,
  /** the name to reference from Spotlight */
  name: string,
  /** the name to reference from Spotlight */
  spotlightRegistry: RegistryType,
};

const errorMessage =
  '`SpotlightTarget` requires `SpotlightManager` as an ancestor.';

class SpotlightTarget extends Component<Props> {
  node: HTMLElement;
  componentDidMount() {
    const { name, spotlightRegistry } = this.props;

    if (!spotlightRegistry) {
      throw new Error(errorMessage);
    } else {
      spotlightRegistry.add(name, this.node);
    }
  }
  componentWillUnmount() {
    const { name, spotlightRegistry } = this.props;

    if (!spotlightRegistry) {
      throw new Error(errorMessage);
    } else {
      spotlightRegistry.remove(name);
    }
  }
  getNode = (ref: ElementRef<*>) => {
    this.node = ref;
  };
  render() {
    return (
      <NodeResolver innerRef={this.getNode}>
        {Children.only(this.props.children)}
      </NodeResolver>
    );
  }
}
export default withSpotlightState(SpotlightTarget);
