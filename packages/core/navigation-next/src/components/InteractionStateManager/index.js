// @flow

import React, { Component, type Node } from 'react';

export type InteractionState = {
  isActive: boolean,
  isHover: boolean,
};

type Props = {
  children: InteractionState => Node,
};

export default class InteractionStateManager extends Component<
  Props,
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

  onMouseUp = () => this.setState({ isActive: false });

  onMouseEnter = () => this.setState({ isHover: true });

  onMouseLeave = () => this.setState({ isActive: false, isHover: false });

  render() {
    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
        role="presentation"
      >
        {this.props.children(this.state)}
      </div>
    );
  }
}
