// @flow
import React, { PureComponent } from 'react';

import ContainerNavigationNestedPage from './ContainerNavigationNestedPage';
import NestedNavigationWrapper from '../../styled/NestedNavigationWrapper';
import type {
  Stack,
  TraversalDirection,
  ContainerNavigationNestedType as Props,
} from './types';

type State = {
  stack: Stack,
  traversalDirection: TraversalDirection,
};

export default class ContainerNavigationNested extends PureComponent<
  Props,
  State,
> {
  state = {
    stack: this.props.stack,
    traversalDirection: 'down',
  };

  componentWillReceiveProps({ stack }: { stack: Stack }): any {
    const traversalDirection = (() => {
      if (stack.length !== this.props.stack.length) {
        return stack.length < this.props.stack.length ? 'up' : 'down';
      }
      return this.state.traversalDirection;
    })();

    this.setState({ traversalDirection }, () => {
      this.setState({ stack });
    });
  }

  renderChildren = () => (
    <ContainerNavigationNestedPage
      key={this.state.stack.length}
      onAnimationEnd={this.props.onAnimationEnd}
      traversalDirection={this.state.traversalDirection}
    >
      {this.state.stack[this.state.stack.length - 1]}
    </ContainerNavigationNestedPage>
  );

  render() {
    return (
      <NestedNavigationWrapper
        component="div"
        traversalDirection={this.state.traversalDirection}
      >
        {this.renderChildren()}
      </NestedNavigationWrapper>
    );
  }
}
