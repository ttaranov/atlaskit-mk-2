// @flow
import React, { Children, Component, type Node } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TransitionGroup } from 'react-transition-group';
import supportsReactPortal from '../util/supportsReactPortal';
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

  render() {
    const { children } = this.props;

    return (
      <GatewayProvider>
        <AppWrapper innerRef={this.getAppRef}>
          {Children.only(children)}
        </AppWrapper>
        {supportsReactPortal ? null : (
          <div>
            <GatewayDest name="modal" component={TransitionGroup} />
            <GatewayDest name="spotlight" component={TransitionGroup} />
            <GatewayDest name="flag" />
            <GatewayDest name="tooltip" component={TransitionGroup} />
          </div>
        )}
      </GatewayProvider>
    );
  }
}
