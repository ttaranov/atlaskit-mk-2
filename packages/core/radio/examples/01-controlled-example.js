// @flow
import React, { Component } from 'react';
import { RadioGroup } from '../src';
import type { OptionsPropType } from '../src/types';

type State = {
  checkedValue: string | number | null,
  options: OptionsPropType,
};
export default class StatelessExample extends Component<void, State> {
  state = {
    checkedValue: null,
    options: [
      { name: 'color2', value: 'red', label: 'Red' },
      { name: 'color2', value: 'blue', label: 'Blue' },
      { name: 'color2', value: 'yellow', label: 'Yellow' },
      { name: 'color2', value: 'green', label: 'Green' },
    ],
  };

  setValue = (e: any) => {
    console.log(e.target.value);
    this.setState({
      checkedValue: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <RadioGroup
          options={this.state.options}
          checkedValue={this.state.checkedValue}
          label="Pick a color (Checked state isn't managed by the component):"
          onChange={this.setValue}
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
          onChange called with value: {this.state.checkedValue}
        </div>
      </div>
    );
  }
}
