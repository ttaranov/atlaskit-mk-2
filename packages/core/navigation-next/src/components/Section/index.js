// @flow

import React, { PureComponent, Fragment } from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';

import { animationDurationMs } from '../../common';
import { getSectionWrapperStyles } from './styles';
import type { SectionProps, SectionState } from './types';

export default class Section extends PureComponent<SectionProps, SectionState> {
  state = {
    traversalDirection: null,
  };

  componentWillReceiveProps(nextProps: SectionProps) {
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
