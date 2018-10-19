// @flow

import React, { Component } from 'react';

import type { InteractionState, InteractionStateProps } from './types';

export default class InteractionStateManager extends Component<
  InteractionStateProps,
  InteractionState,
> {
  state = {
    isActive: false,
    isHover: false,
  };

  onMouseDown = (e: Event) => {
    e.preventDefault();
    this.setState({ isActive: true });
  };

  onMouseUp = (e: Event) => {
    e.preventDefault();
    this.setState({ isActive: false, isHover: true });
  };

  onMouseOver = () => {
    if (!this.state.isHover) {
      this.setState({ isHover: true });
    }
  };

  onMouseLeave = () => {
    this.setState({ isActive: false, isHover: false });
  };

  render() {
    const { styles } = this.props;
    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
        role="presentation"
        css={{
          width: '100%',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          ...styles,
        }}
      >
        {this.props.children(this.state)}
      </div>
    );
  }
}
