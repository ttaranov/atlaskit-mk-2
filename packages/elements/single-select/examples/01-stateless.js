// @flow

import React, { PureComponent } from 'react';
import { StatelessSelect } from '../src';
import type { ItemType } from '../src/types';

const selectItems = [
  {
    heading: 'Cities',
    items: [
      { content: 'Sydney', value: 'sydney' },
      { content: 'Canberra', value: 'canberra' },
    ],
  },
  {
    heading: 'Animals',
    items: [
      { content: 'Sheep', value: 'sheep' },
      { content: 'Cow', value: 'cow', isDisabled: true },
    ],
  },
];

type State = {
  isOpen: boolean,
  filterValue: string,
  selectedItem?: ItemType,
};

export default class StatelessExample extends PureComponent<{}, State> {
  state = {
    isOpen: false,
    filterValue: '',
    selectedItem: undefined,
  };

  onSelected = (item: ItemType) => {
    this.setState({
      isOpen: false,
      selectedItem: item,
      filterValue: '',
    });
  };
  toggleOpen = ({ isOpen }: Object) => this.setState({ isOpen });
  updateFilter = (filterValue: string) => this.setState({ filterValue });

  render() {
    return (
      <div>
        <StatelessSelect
          items={selectItems}
          isOpen={this.state.isOpen}
          onOpenChange={this.toggleOpen}
          hasAutocomplete
          onFilterChange={this.updateFilter}
          filterValue={this.state.filterValue}
          onSelected={this.onSelected}
          selectedItem={this.state.selectedItem}
        />
      </div>
    );
  }
}
