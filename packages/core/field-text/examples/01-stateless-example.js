// @flow
import React, { Component } from 'react';
import { FieldTextStateless } from '../src';

type State = {
  value: string | number,
};

export default function StatelessExample (props) {
  const state = useState({
    value: '',
  };

  setValue = (e: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({ value: e.target.value });

  render() {
    return (
      <FieldTextStateless
        label="Stateless Text Input Example"
        onChange={this.setValue}
        value={this.state.value}
      />
    );
  }
}
