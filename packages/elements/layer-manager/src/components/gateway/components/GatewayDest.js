// @flow
import { Component, type Node, type ElementType, createElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import GatewayRegistry from './GatewayRegistry';

type Props = {
  name: string,
  component: ElementType,
};
type State = {
  children: Node,
};
type Context = {
  gatewayRegistry: GatewayRegistry,
};

export default class GatewayDest extends Component<Props, State> {
  gatewayRegistry: GatewayRegistry;
  domNode: HTMLElement;
  static contextTypes = {
    gatewayRegistry: PropTypes.instanceOf(GatewayRegistry).isRequired,
  };
  static defaultProps = {
    component: 'div',
  };
  state = {
    children: null,
  };

  constructor(props: Props, context: Context) {
    super(props, context);
    this.gatewayRegistry = context.gatewayRegistry;
  }
  componentWillMount() {
    this.gatewayRegistry.addContainer(this.props.name, this);
  }
  componentWillUnmount() {
    this.gatewayRegistry.removeContainer(this.props.name);
  }

  getRef = (r: Element) => {
    // eslint-disable-next-line react/no-find-dom-node
    this.domNode = findDOMNode(r);
    console.log(this.domNode);
  };

  render() {
    const { component, ...attrs } = this.props;
    delete attrs.name;

    return createElement(
      component,
      { ...attrs, ref: this.getRef },
      this.state.children,
    );
  }
}
