// @flow
import React, { PureComponent } from 'react';
import { RadioGroup } from '../src';
import type { OptionsPropType } from '../src/types';

const options: OptionsPropType = [
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'blue', label: 'Blue', defaultChecked: true },
  { name: 'color', value: 'yellow', label: 'Yellow' },
  { name: 'color', value: 'green', label: 'Green' },
];

type State = {
  onChangeResult: string,
};

export default class BasicExample extends PureComponent<void, State> {
  state = {
    onChangeResult: 'Click on a radio field to trigger onChange',
  };

  onChange = (event: any) => {
    this.setState({
      onChangeResult: `onChange called with value: ${event.target.value}`,
    });
  };

  render() {
    return (
      <div>
        <p>Pick a color:</p>
        <RadioGroup options={options} onChange={this.onChange} />
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
          {this.state.onChangeResult}
        </div>
      </div>
    );
  }
}
