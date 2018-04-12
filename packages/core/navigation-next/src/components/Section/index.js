// @flow

import React, { Component, Fragment, type Node } from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';

import { animationDurationMs } from '../../common';
import { getSectionWrapperStyles } from './styles';

export type RenderProvided = {
  css: {},
};

type Props = {
  id?: string,
  parentId?: string,
  children: RenderProvided => Node,
};

type State = {
  traversalDirection: 'down' | 'up' | null,
};

export default class Section extends Component<Props, State> {
  state = {
    traversalDirection: null,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.parentId && nextProps.parentId === this.props.id) {
      this.setState({ traversalDirection: 'down' });
    }
    if (this.props.parentId && this.props.parentId === nextProps.id) {
      this.setState({ traversalDirection: 'up' });
    }
  }

  render() {
    const { id, children } = this.props;

    return (
      <TransitionGroup component={Fragment}>
        <Transition key={id} timeout={animationDurationMs}>
          {state => {
            const { traversalDirection } = this.state;
            const css = getSectionWrapperStyles({ state, traversalDirection });
            return children({ css });
          }}
        </Transition>
      </TransitionGroup>
    );
  }
}
