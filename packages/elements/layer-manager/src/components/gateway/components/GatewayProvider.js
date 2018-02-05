// @flow
import React, { Component, type ElementType, type Node } from 'react';
import PropTypes from 'prop-types';
import GatewayRegistry from './GatewayRegistry';
import supportsReactPortal from '../../../util/supportsReactPortal';

type Props = {
  component: ElementType,
  children: Node,
};
type Context = {
  gatewayRegistry: GatewayRegistry,
};

export default class GatewayProvider extends Component<Props> {
  gatewayRegistry: GatewayRegistry;
  static childContextTypes = {
    gatewayRegistry: PropTypes.instanceOf(GatewayRegistry).isRequired,
  };
  static defaultProps = {
    component: 'div',
  };

  constructor(props: Props, context: Context) {
    super(props, context);
    this.gatewayRegistry = new GatewayRegistry();
    if (supportsReactPortal) {
      const modalEl = document.createElement('div');
      if (document.body) document.body.appendChild(modalEl);
      this.gatewayRegistry.addContainer('modal', modalEl);
    }
  }

  getChildContext() {
    return {
      gatewayRegistry: this.gatewayRegistry,
    };
  }

  render() {
    const { children, component: Tag } = this.props;

    return <Tag>{children}</Tag>;
  }
}
