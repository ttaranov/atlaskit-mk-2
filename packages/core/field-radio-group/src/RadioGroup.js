// @flow
import React, { Component } from 'react';
import AkFieldRadioGroup from './RadioGroupStateless';
import type { RadioGroupPropTypes, ItemsPropTypeSmart } from './types';

const defaultItems = [];

type State = {
  selectedValue: number | string | null,
};

type DefaultPropsTypes = {
  isRequired: boolean,
  items: ItemsPropTypeSmart,
  onRadioChange: (SyntheticEvent<*>) => mixed,
};
export default class FieldRadioGroup extends Component<
  RadioGroupPropTypes,
  State,
> {
  static defaultProps: DefaultPropsTypes = {
    isRequired: false,
    items: defaultItems,
    onRadioChange: () => {},
  };

  constructor() {
    super();
    this.state = {
      selectedValue: null, // Overrides default once user selects a value.
    };
  }

  getItems = (): any => {
    // If there is a user-selected value, then select that item
    if (this.props.items) {
      if (this.state.selectedValue) {
        return this.props.items.map(
          item =>
            item.value === this.state.selectedValue
              ? { ...item, ...{ isSelected: true } }
              : item,
        );
      }

      // Otherwise, look for a defaultSelected item and select that item
      const hasDefaultSelected: boolean = this.props.items.some(
        item => item.defaultSelected,
      );
      if (hasDefaultSelected && this.props.items) {
        return this.props.items.map(
          item =>
            item.defaultSelected ? { ...item, ...{ isSelected: true } } : item,
        );
      }
    }
    return this.props.items;
  };

  changeHandler = (event: any) => {
    this.props.onRadioChange(event);
    this.setState({ selectedValue: event.target.value });
  };

  render() {
    return (
      <AkFieldRadioGroup
        label={this.props.label}
        onRadioChange={this.changeHandler}
        isRequired={this.props.isRequired}
        items={this.getItems()}
      />
    );
  }
}
