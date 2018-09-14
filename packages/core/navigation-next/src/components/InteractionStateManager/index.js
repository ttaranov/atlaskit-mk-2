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
    isClicked: false,
  };

  onMouseDown = (e: Event) => {
    e.preventDefault();
    this.setState({ isActive: true });
  };

  onMouseUp = () => {
    this.setState({ isActive: false });
  };

  onMouseOver = () => {
    if (!this.state.isHover && !this.state.isClicked) {
      this.setState({ isHover: true });
    }
    if (this.state.isClicked) {
      this.setState({ isHover: false });
    }
  };

  onClick = () => this.setState({ isClicked: true });

  onMouseLeave = () => {
    const newStates =
      !this.state.isActive && !this.state.isHover
        ? { isActive: false, isHover: false }
        : { isActive: false, isHover: false, isClicked: false };
    this.setState(newStates);
  };

  render() {
    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
        onClick={this.onClick}
        role="presentation"
      >
        {this.props.children(this.state)}
      </div>
    );
  }
}
