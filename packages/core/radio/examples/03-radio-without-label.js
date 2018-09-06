// @flow
import React, { Component } from 'react';
import { Radio } from '../src';

type State = {
  items: Array<*>,
  isActive: boolean,
  isChecked: boolean,
  isFocused: boolean,
  isMouseDown: boolean,
  checkedValue: string,
};

const items: Array<{
  isChecked?: boolean,
  value: string,
  name: string,
  id: number,
}> = [
  { value: 'blue', name: 'colors', isChecked: true, id: 1 },
  { value: 'red', name: 'colors', id: 2 },
  { value: 'purple', name: 'colors', id: 3 },
  { value: 'grey', name: 'colors', id: 4 },
];

export default class RadioInputExample extends Component<*, State> {
  state = {
    items: (items.slice(): Array<*>),
    checkedValue: '',
    isActive: false,
    isChecked: false,
    isMouseDown: false,
    isFocused: false,
  };

  onBlur = () => {
    this.setState({
      isActive: this.state.isMouseDown && this.state.isActive,
      isFocused: false,
    });
  };

  onFocus = () => {
    this.setState({
      isFocused: true,
    });
  };
  onChange = ({ currentTarget: { value } }: SyntheticEvent<*>) => {
    const newItems = this.state.items.slice().map(item => {
      if (item.value === value)
        return {
          ...item,
          isChecked: true,
        };
      return {
        ...item,
        isChecked: false,
      };
    });
    this.setState({
      items: newItems,
    });
  };
  render() {
    return (
      <table>
        {this.state.items.map(item => (
          <tr>
            <td>
              <Radio
                key={`${item.value}${item.name}${item.id}`}
                isChecked={item.isChecked}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                onChange={this.onChange}
                name={item.name}
                value={item.value}
              />
            </td>
            <td>
              <p>{item.value}</p>
            </td>
          </tr>
        ))}
      </table>
    );
  }
}
