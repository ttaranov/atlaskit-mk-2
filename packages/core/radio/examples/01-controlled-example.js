// @flow
import React, { Component } from 'react';
import { RadioGroup } from '../src';
import type { ItemsPropType } from '../src/types';

type State = {
  selectedValue: string | number | null,
  items: ItemsPropType,
};
export default class StatelessExample extends Component<void, State> {
  state = {
    selectedValue: null,
    items: [
      { name: 'color2', value: 'red', label: 'Red' },
      { name: 'color2', value: 'blue', label: 'Blue' },
      { name: 'color2', value: 'yellow', label: 'Yellow' },
    ],
  };

  setValue = (e: any) => {
    this.setState({
      selectedValue: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <RadioGroup
          items={this.state.items}
          selectedValue={this.state.selectedValue}
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
          onRadioChange called with value: {this.state.selectedValue}
        </div>
      </div>
    );
  }
}
