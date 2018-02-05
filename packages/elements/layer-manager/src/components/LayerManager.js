// @flow
import React, { Children, Component, type Node } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TransitionGroup } from 'react-transition-group';
import { GatewayDest, GatewayProvider } from './gateway';

// NOTE: lock the app wrapper to a 0 z-index. This allows layer manager to
// render all gateways hierarchically, on top of the app, without needing
// incremental z-indexes.
const AppWrapper = styled.div`
  position: relative;
  z-index: 0;
`;

type Props = { children: Node };
type State = { ariaHiddenNode?: HTMLElement };

export default class LayerManager extends Component<Props, State> {
  state = { ariaHiddenNode: undefined };
  destRefs = {
    modal: null,
    spotlight: null,
    flag: null,
    tooltip: null,
  };
  static childContextTypes: Object = { ariaHiddenNode: PropTypes.object };

  getChildContext() {
    return {
      ariaHiddenNode: this.state.ariaHiddenNode,
    };
  }

  getAppRef = (ref: HTMLElement) => {
    if (this.state.ariaHiddenNode) return;

    this.setState({ ariaHiddenNode: ref });
  };

  getDestRef = (name: string) => (ref: HTMLElement) => {
    this.destRefs = {
      ...this.destRefs,
      [name]: ref,
    };
    console.log(this.destRefs);
  };

  render() {
    const { children } = this.props;

    return (
      <GatewayProvider destRefs={this.destRefs}>
        <AppWrapper innerRef={this.getAppRef}>
          {Children.only(children)}
        </AppWrapper>
        <div ref={this.getDestRef('modal')} />
        {/* <GatewayDest name="modal" innerRef={this.getDestRef('modal')} component={TransitionGroup} /> */}
        <GatewayDest name="spotlight" component={TransitionGroup} />
        <GatewayDest name="flag" />
        <GatewayDest name="tooltip" component={TransitionGroup} />
      </GatewayProvider>
    );
  }
}
