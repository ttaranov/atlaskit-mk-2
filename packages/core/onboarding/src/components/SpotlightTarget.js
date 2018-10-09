// @flow
import React, { Component, type ElementType } from 'react';
import NodeResolver from 'react-node-resolver';

import { TargetConsumer } from './SpotlightManager';
import { type RegistryType } from './SpotlightRegistry';

type Props = {
  /** a single child */
  children: ElementType,
  /** the name to reference from Spotlight */
  name: string,
  /** the name to reference from Spotlight */
  spotlightRegistry: RegistryType,
};

class SpotlightTarget extends Component<Props> {
  render() {
    return (
      <TargetConsumer>
        {targetRef => (
          <NodeResolver innerRef={targetRef(this.props.name)}>
            {this.props.children}
          </NodeResolver>
        )}
      </TargetConsumer>
    );
  }
}
export default SpotlightTarget;
