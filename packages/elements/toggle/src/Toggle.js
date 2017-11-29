// @flow
import React, { Component } from 'react';
import ToggleStateless from './ToggleStateless';
import type { StatefulProps } from './types';

type DefaultProps = {|
  onChange: (event: Event) => void,
  isDefaultChecked: boolean,
|};

type State = {|
  isChecked: boolean,
|};

// This component is a thin wrapper around the stateless component that manages
// the isChecked state for you
export default class Toggle extends Component<StatefulProps, State> {
  static defaultProps: DefaultProps = {
    isDefaultChecked: false,
    onChange: () => {},
  };

  state: State = {
    isChecked: this.props.isDefaultChecked,
  };

  onChange = (event: Event) => {
    this.setState({ isChecked: !this.state.isChecked });
    this.props.onChange(event);
  };

  render() {
    return (
      <ToggleStateless
        {...this.props}
        isChecked={this.state.isChecked}
        onChange={this.onChange}
      />
    );
  }
}
