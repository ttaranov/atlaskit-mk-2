// @flow
import React, { Children, Component, type Node } from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';
import GatewayRegistry from './GatewayRegistry';
import supportsReactPortal from '../../../util/supportsReactPortal';

type Props = {
  into: string,
  children?: Node,
  shouldBlockRender?: boolean,
  withTransitionGroup?: boolean,
};
type Context = {
  gatewayRegistry: GatewayRegistry,
};

const FirstChild = ({ children }) => Children.toArray(children)[0] || null;

export default class Gateway extends Component<Props> {
  gatewayRegistry: GatewayRegistry;
  id: string = '';
  portalDomNode: HTMLElement;
  layerProps = {};
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
      this.onLayerChange,
    );
    this.renderIntoGatewayNode(this.props);
  }

  componentDidMount() {
    console.log('gateway mounted', this.portalDomNode);
  }

  componentWillReceiveProps(props: Props) {
    if (!props.shouldBlockRender) {
      this.gatewayRegistry.clearChild(this.props.into, this.id);
      this.renderIntoGatewayNode(props);
    }
  }

  componentWillUnmount() {
    this.gatewayRegistry.unregister(this.props.into, this.id);
    // this.render();
    // setTimeout(() => unmountComponentAtNode(this.portalDomNode), 5000);
  }

  renderIntoGatewayNode(props: Props) {
    this.portalDomNode = this.gatewayRegistry.addChild(
      this.props.into,
      this.id,
      props.children,
    );
    console.log('render into gateway node', this.portalDomNode);
  }

  onLayerChange = (layerProps: {}) => {
    this.layerProps = layerProps;
    this.forceUpdate();
  };

  render() {
    console.log('rendering gateway', this.portalDomNode);
    const childrenWithLayerProps = React.cloneElement(
      this.props.children,
      this.layerProps,
    );
    const children = this.props.withTransitionGroup ? (
      <TransitionGroup>{childrenWithLayerProps}</TransitionGroup>
    ) : (
      childrenWithLayerProps
    );
    return supportsReactPortal
      ? ReactDOM.createPortal(children, this.portalDomNode)
      : null;
  }
}
