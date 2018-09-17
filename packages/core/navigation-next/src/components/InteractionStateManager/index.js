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
    isSelected: false,
  };

  onMouseDown = (e: Event) => {
    e.preventDefault();
    this.setState(() => ({ isActive: true }));
  };

  onMouseUp = (e: Event) => {
    e.preventDefault();
    this.setState(state => ({
      isActive: false,
      isSelected: state.isActive,
      isHover: false,
    }));
  };

  onMouseOver = () => {
    if (!this.state.isHover && !this.state.isSelected) {
      this.setState(() => ({ isHover: true }));
    } else if (this.state.isSelected && !this.state.isActive) {
      this.setState(() => ({ isActive: false }));
    }
  };

  onMouseLeave = () => {
    this.setState(() => ({
      isActive: false,
      isHover: false,
    }));
  };

  render() {
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
        }}
      >
        {this.props.children(this.state)}
      </div>
    );
  }
}
