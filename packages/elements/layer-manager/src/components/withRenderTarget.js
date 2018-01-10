// @flow
import React, { Component, type ComponentType, type ElementRef } from 'react';
import PropTypes from 'prop-types';

import { Gateway, GatewayRegistry } from './gateway';
import Portal from './Portal';
import withContextFromProps from './withContextFromProps';

type Props = {
  target: string,
  withTransitionGroup: boolean,
};

export default function withRenderTarget(
  { target, withTransitionGroup }: Props,
  WrappedComponent: ComponentType<{}>,
) {
  // Access the analytics context types so we can provide them across portal boundaries
  // until we can support React 16 where it can be provided natively
  const analyticsContextTypes = {
    onAnalyticsEvent: PropTypes.func,
    getParentAnalyticsData: PropTypes.func,
  };

  const ContextProvider = withContextFromProps(analyticsContextTypes, null);

  // eslint-disable-next-line react/prefer-stateless-function
  return class extends Component<{}> {
    gatewayOrPortalChildRef: ElementRef<any> | null;
    static contextTypes = {
      gatewayRegistry: PropTypes.instanceOf(GatewayRegistry),
      renderDescendantGateways: PropTypes.bool,
      ...analyticsContextTypes,
    };
    getWrappedComponentRef = (ref: ElementRef<any> | null): mixed => {
      this.gatewayOrPortalChildRef = ref;
    };
    render() {
      const { gatewayRegistry, ...analyticsContext } = this.context;
      const GatewayOrPortal = gatewayRegistry ? Gateway : Portal;
      const shouldRender = this.context.renderDescendantGateways !== false;

      return (
        <GatewayOrPortal
          id={process.env.NODE_ENV === 'test' ? 'gateway-or-portal' : ''}
          into={target}
          withTransitionGroup={withTransitionGroup}
          shouldRender={shouldRender}
        >
          <ContextProvider {...analyticsContext}>
            <WrappedComponent
              ref={this.getWrappedComponentRef}
              {...this.props}
            />
          </ContextProvider>
        </GatewayOrPortal>
      );
    }
  };
}
