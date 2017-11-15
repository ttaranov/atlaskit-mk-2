// @flow
import React from 'react';
import Badge from '../src';

type State = {
  value: number,
};

export default class Component extends React.Component<void, State> {
  state = {
    value: 1,
  };

  handleIncrement = () => {
    this.setState({
      value: this.state.value + 1,
    });
  };

  handleValueUpdated = (detail: {}) => {
    console.log('onValueUpdated called with:', detail);
  };

  render() {
    return (
      <div>
        <Badge
          onValueUpdated={this.handleValueUpdated}
          value={this.state.value}
        />
        <button onClick={this.handleIncrement}>Increment</button>
      </div>
    );
  }
}
