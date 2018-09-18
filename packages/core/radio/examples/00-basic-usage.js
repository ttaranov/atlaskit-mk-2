// @flow
import React, { PureComponent } from 'react';
import { RadioGroup } from '../src';
import type { OptionsPropType } from '../src/types';

const options: OptionsPropType = [
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'blue', label: 'Blue' },
  { name: 'color', value: 'yellow', label: 'Yellow' },
  { name: 'color', value: 'green', label: 'Green' },
];

type State = {
  currentValue: string | null,
  onChangeResult: string,
};

export default class BasicExample extends PureComponent<void, State> {
  state = {
    currentValue: null,
    onChangeResult: 'Click on a radio field to trigger onChange',
  };

  onChange = (event: any) => {
    const newValue = event.target.value;
    this.setState({
      onChangeResult: `onChange called with value: ${newValue}`,
    });
  };

  render() {
    return (
      <div>
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
          onChange called with value: {this.state.currentValue}
        </div>
      </div>
    );
  }
}
