// @flow
import React, { PureComponent } from 'react';

import { MultiSelectStateless } from '../src';
import type { ItemType } from '../src/types';

const selectItems = [
  {
    items: [
      { content: 'Sydney', value: 'city_1' },
      { content: 'Canberra', value: 'city_2' },
      { content: 'Melbourne', value: 'city_3' },
      { content: 'Perth', value: 'city_4', isDisabled: true },
      { content: 'Some city with spaces', value: 'city_5' },
      { content: 'Some city with another spaces', value: 'city_6' },
    ],
  },
];

type Props = {
  id: string,
  isDisabled: boolean,
  shouldFocus: boolean,
  isDefaultOpen: boolean,
  isRequired: boolean,
  items: Array<ItemType>, // Array, same shape as MultiSelectStateless
  label: string,
  name: string,
  placeholder: string,
};

type State = {
  isOpen: boolean,
  selectedItems: Array<ItemType>,
  filterValue: string,
};

export default class CustomMultiSelect extends PureComponent<Props, State> {
  static defaultProps = {
    isDisabled: false,
    shouldFocus: false,
    isDefaultOpen: false,
    isRequired: false,
    items: selectItems,
    label: 'Choose your favourite',
    placeholder: 'Australia',
    name: 'test',
  };

  // we need to keep track of this state ourselves and pass it back into the MultiSelectStateless
  state = {
    isOpen: this.props.isDefaultOpen,
    selectedItems: [],
    filterValue: '',

    // we could also keep track of isInvalid here
  };

  selectItem = (item: ItemType) => {
    const selectedItems = [...this.state.selectedItems, item];
    this.setState({ selectedItems });
  };

  removeItem = (item: ItemType) => {
    const selectedItems = this.state.selectedItems.filter(
      i => i.value !== item.value,
    );
    this.setState({ selectedItems });
  };

  selectedChange = (item: ItemType) => {
    if (this.state.selectedItems.some(i => i.value === item.value)) {
      this.removeItem(item);
    } else {
      this.selectItem(item);
    }
    // we could update isInvalid here
  };

  handleFilterChange = (value: string) => {
    // value will tell us the value the filter wants to change to
    this.setState({ filterValue: value });
  };

  handleOpenChange = (attrs: {
    event: SyntheticEvent<any>,
    isOpen: boolean,
  }) => {
    // attrs.isOpen will tell us the state that the dropdown wants to move to
    this.setState({ isOpen: attrs.isOpen });
  };

  render() {
    return (
      <MultiSelectStateless
        filterValue={this.state.filterValue}
        id={this.props.id}
        isDisabled={this.props.isDisabled}
        isOpen={this.state.isOpen}
        isRequired={this.props.isRequired}
        items={this.props.items}
        label={this.props.label}
        name={this.props.name}
        noMatchesFound="Uh oh! No matches found!"
        onFilterChange={this.handleFilterChange}
        onOpenChange={this.handleOpenChange}
        onRemoved={this.selectedChange}
        onSelected={this.selectedChange}
        placeholder={this.props.placeholder}
        selectedItems={this.state.selectedItems}
        shouldFocus={this.props.shouldFocus}
        shouldFitContainer
      />
    );
  }
}
