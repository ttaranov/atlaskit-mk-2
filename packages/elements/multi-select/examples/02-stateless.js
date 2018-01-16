// @flow
import React, { PureComponent } from 'react';
import { MultiSelectStateless } from '../src';
import type { GroupType, ItemType } from '../src/types';

const selectItems: Array<GroupType> = [
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
  selectedItems: Array<ItemType>,
};

export default class StatelessExample extends PureComponent<{}, State> {
  state: State = {
    isOpen: false,
    filterValue: '',
    selectedItems: [],
  };

  onSelected = (item: ItemType) => {
    let newSelectedItems;
    if (!this.state.selectedItems) newSelectedItems = [item];
    else newSelectedItems = [...this.state.selectedItems, item];
    this.setState({
      isOpen: false,
      selectedItems: newSelectedItems,
      filterValue: '',
    });
  };
  onRemoved = (item: ItemType) => {
    this.setState({
      selectedItems: this.state.selectedItems.filter(
        i => i.value !== item.value,
      ),
    });
  };
  toggleOpen = ({ isOpen }: Object) => this.setState({ isOpen });
  updateFilter = (filterValue: string) => this.setState({ filterValue });

  render() {
    return (
      <div>
        <MultiSelectStateless
          items={selectItems}
          placeholder="Choose a City"
          isOpen={this.state.isOpen}
          onOpenChange={this.toggleOpen}
          hasAutocomplete
          onFilterChange={this.updateFilter}
          filterValue={this.state.filterValue}
          onSelected={this.onSelected}
          onRemoved={this.onRemoved}
          selectedItems={this.state.selectedItems}
        />
      </div>
    );
  }
}
