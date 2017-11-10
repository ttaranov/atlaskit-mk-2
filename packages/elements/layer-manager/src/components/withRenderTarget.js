// @flow
import React, { Component, type ComponentType } from 'react';
import PropTypes from 'prop-types';

import { Gateway, GatewayRegistry } from './gateway';
import Portal from './Portal';

type Props = {};

export default function withRenderTarget(
  { target, withTransitionGroup }:
  { target: string, withTransitionGroup: boolean },
  WrappedComponent: ComponentType<*>,
) {
  // eslint-disable-next-line react/prefer-stateless-function
  return class extends Component<Props> {
    static contextTypes = {
      gatewayRegistry: PropTypes.instanceOf(GatewayRegistry),
    }

    render() {
      const { gatewayRegistry } = this.context;
      const GatewayOrPortal = gatewayRegistry ? Gateway : Portal;

      return (
        <GatewayOrPortal into={target} withTransitionGroup={withTransitionGroup}>
          <WrappedComponent {...this.props} />
        </GatewayOrPortal>
      );
    }
  };
}
