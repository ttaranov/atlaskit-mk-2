// @flow
import React, { Component } from 'react';
import { FieldTextAreaStateless } from '../src';

type State = {|
  value: string | number,
|};
export default class StatelessExample extends Component<void, State> {
  state = {
    value: '',
  };

  setValue = (e: any) => this.setState({ value: e.target.value });

  render() {
    return (
      <div>
        <FieldTextAreaStateless
          label="Stateless Text Input Example"
          onChange={this.setValue}
          value={this.state.value}
        />
        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        >
          State updated onChange with value: {this.state.value}
        </div>
      </div>
    );
  }
}
