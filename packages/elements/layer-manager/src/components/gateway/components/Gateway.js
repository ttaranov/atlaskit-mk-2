// @flow
import { Component, type Node } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import GatewayRegistry from './GatewayRegistry';

type Props = {
  into: string,
  children?: Node,
  shouldBlockRender?: boolean,
};
type Context = {
  gatewayRegistry: GatewayRegistry,
};

const supportsReactPortals = typeof ReactDOM.createPortal === 'function';

export default class Gateway extends Component<Props> {
  gatewayRegistry: GatewayRegistry;
  id: string = '';
  portalDomNode: HTMLElement;
  static contextTypes: Context = {
    gatewayRegistry: PropTypes.instanceOf(GatewayRegistry).isRequired,
  };

  constructor(props: Props, context: Context) {
    super(props, context);
    this.gatewayRegistry = context.gatewayRegistry;
  }
  componentWillMount() {
    this.id = this.gatewayRegistry.register(
      this.props.into,
      this.props.children,
    );
    this.renderIntoGatewayNode(this.props);
  }

  componentWillReceiveProps(props: Props) {
    // if (!props.shouldBlockRender) {
    //   this.gatewayRegistry.clearChild(this.props.into, this.id);
    //   this.renderIntoGatewayNode(props);
    // }
  }

  componentWillUnmount() {
    this.gatewayRegistry.unregister(this.props.into, this.id);
  }

  renderIntoGatewayNode(props: Props) {
    this.portalDomNode = this.gatewayRegistry.addChild(
      this.props.into,
      this.id,
      props.children,
    );
  }

  render() {
    return supportsReactPortals
      ? ReactDOM.createPortal(this.props.children, this.portalDomNode)
      : null;
  }
}
