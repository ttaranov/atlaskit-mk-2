// @flow
import React, { Component } from 'react';
import { StatelessSelect } from '../src';
import type { ItemType } from '../src/types';

const selectItems = [
  {
    heading: 'Cities',
    items: [
      { content: 'Sydney', value: 'city_1' },
      { content: 'Canberra', value: 'city_2' },
      { content: 'Melbourne', value: 'city_3' },
      { content: 'Perth', value: 'city_4', isDisabled: true },
    ],
  },
];

type State = {
  isSelectOpen?: boolean,
  selectedItem?: ItemType,
};

export default class StatelessSelectOverview extends Component<{}, State> {
  state: State = {
    isSelectOpen: false,
    selectedItem: undefined,
  };

  render() {
    return (
      <StatelessSelect
        items={selectItems}
        isOpen={this.state.isSelectOpen}
        onOpenChange={attrs => {
          this.setState({ isSelectOpen: attrs.isOpen });
        }}
        onSelected={item => {
          this.setState({ isSelectOpen: false, selectedItem: item });
        }}
        selectedItem={this.state.selectedItem}
        placeholder="Select all!"
        label="Choose your favourite"
      />
    );
  }
}
