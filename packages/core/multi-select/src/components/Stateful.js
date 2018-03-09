// @flow
import React, { PureComponent, type Node } from 'react';
import uuid from 'uuid';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';

import MultiSelectStateless from './Stateless';

import type { FooterType, GroupType, ItemType } from '../types';

// =============================================================
// NOTE: Duplicated in ./internal/appearances until docgen can follow imports.
// -------------------------------------------------------------
// DO NOT update values here without updating the other.
// =============================================================

const appearances = {
  values: ['default', 'subtle'],
  default: 'default',
};
type Props = {
  /** Subtle items do not have a background color. */
  appearance: 'default' | 'subtle',
  /** Message to display in footer after the name of the new item. Only applicable if
   * shouldAllowCreateItem prop is set to true. */
  createNewItemLabel: string,
  /** An array of items that will be selected on component mount. */
  defaultSelected: Array<ItemType>,
  /** Element to show after the list of item. Accepts an object of a specific shape */
  footer?: FooterType,
  /** id property to be passed down to the html select component. */
  id?: string,
  /** message to show on the dialog when isInvalid is true */
  invalidMessage?: Node,
  /** Sets whether the select is selectable. Changes hover state. */
  isDisabled?: boolean,
  /** controls the top margin of the label component rendered. */
  isFirstChild?: boolean,
  /** Sets whether the field will become focused. */
  shouldFocus: boolean,
  /** Set whether the component should be open on mount. */
  isDefaultOpen?: boolean,
  /** Sets whether form including select can be submitted without an option
   being made. */
  isRequired: boolean,
  /** Set whether there is an error with the selection. Sets an orange border
   and shows the warning icon. */
  isInvalid?: boolean,
  /** An array of objects, each one of which must have an array of items, and
  may have a heading. All items should have content and value properties, with
  content being the displayed text. */
  items: Array<GroupType> | Array<ItemType>,
  /** Label to be displayed above select. */
  label: string,
  /** name property to be passed to the html select element. */
  name?: string,
  /** Mesage to display in any group in items if there are no items in it,
   including if there is one item that has been selected. */
  noMatchesFound?: string,
  /** Handler to be called when the filtered items changes.*/
  onFilterChange: Function,
  /** Handler to be called when a new item is created.
   * Only applicable when the shouldAllowCreateItem is set to true.*/
  onNewItemCreated: Function,
  /** Handler to be called on select change. */
  onSelectedChange: Function,
  /** Handler called when the select is opened or closed. Called with an object
   that has both the event, and the new isOpen state. */
  onOpenChange: ({ event: SyntheticEvent<any>, isOpen: boolean }) => void,
  /** Text to be shown within the select when no item is selected. */
  placeholder?: string,
  /** Where the select dropdown should be displayed relative to the field position. */
  position: string,
  /** Sets whether the field should be constrained to the width of its trigger */
  shouldFitContainer?: boolean,
  /** Set whether the dropdown should flip its position when there is not enough
   room in its default position. */
  shouldFlip: boolean,
  /** Sets whether a new item could be created and added to the list by pressing Enter
   * inside the autocomplete field */
  shouldAllowCreateItem: boolean,
  /**
   * Icon to display at the right end of the multi-select
   */
  icon: Node,
};

type State = {
  isOpen?: boolean,
  selectedItems: Array<ItemType>,
  filterValue: string,
  items: Array<any>,
};

export default class MultiSelect extends PureComponent<Props, State> {
  static defaultProps = {
    appearance: appearances.default,
    createNewItemLabel: 'New item',
    defaultSelected: [],
    shouldFocus: false,
    shouldFlip: true,
    isRequired: false,
    items: [],
    label: '',
    onFilterChange: () => {},
    onNewItemCreated: () => {},
    onOpenChange: () => {},
    onSelectedChange: () => {},
    position: 'bottom left',
    shouldAllowCreateItem: false,
    icon: <ExpandIcon label="" />,
  };

  state: State = {
    isOpen: this.props.isDefaultOpen,
    selectedItems: this.props.defaultSelected,
    filterValue: '',
    items: this.props.items,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.items !== this.state.items) {
      this.setState({ items: [...nextProps.items] });
    }
  }

  selectItem = (item: ItemType) => {
    const selectedItems = [...this.state.selectedItems, item];
    this.setState({ selectedItems });
    this.props.onSelectedChange({
      items: selectedItems,
      action: 'select',
      changed: item,
    });
  };

  removeItem = (item: ItemType) => {
    const selectedItems = this.state.selectedItems.filter(
      i => i.value !== item.value,
    );
    this.setState({ selectedItems });
    this.props.onSelectedChange({
      items: selectedItems,
      action: 'remove',
      changed: item,
    });
  };

  selectedChange = (item: ItemType) => {
    if (this.state.selectedItems.some(i => i.value === item.value)) {
      this.removeItem(item);
    } else {
      this.selectItem(item);
    }
  };

  handleFilterChange = (value: string) => {
    this.props.onFilterChange(value);
    this.setState({ filterValue: value });
  };

  handleOpenChange = (attrs: {
    event: SyntheticEvent<any>,
    isOpen: boolean,
  }) => {
    if (this.state.isOpen !== attrs.isOpen) {
      this.props.onOpenChange(attrs);
    }
    this.setState({ isOpen: attrs.isOpen });
  };

  handleNewItemCreate = ({ value: textValue }: Object) => {
    // eslint-disable-line react/no-unused-prop-types
    const { items, selectedItems } = this.state;
    const id = uuid();
    const newItem = { value: id, content: textValue };
    const newItemsArray = [...items];
    newItemsArray[newItemsArray.length - 1].items.push(newItem);

    this.setState({
      items: newItemsArray,
      selectedItems: [...selectedItems, newItem],
      filterValue: '',
    });
    this.props.onNewItemCreated({ value: textValue, item: newItem });
  };

  render() {
    const {
      appearance,
      createNewItemLabel,
      footer,
      id,
      isDisabled,
      isFirstChild,
      isInvalid,
      invalidMessage,
      isRequired,
      label,
      name,
      noMatchesFound,
      placeholder,
      position,
      shouldAllowCreateItem,
      shouldFitContainer,
      shouldFocus,
      shouldFlip,
      icon,
    } = this.props;
    const { filterValue, isOpen, items, selectedItems } = this.state;

    return (
      <MultiSelectStateless
        appearance={appearance}
        createNewItemLabel={createNewItemLabel}
        filterValue={filterValue}
        footer={footer}
        id={id}
        isDisabled={isDisabled}
        isFirstChild={isFirstChild}
        isInvalid={isInvalid}
        invalidMessage={invalidMessage}
        isOpen={isOpen}
        isRequired={isRequired}
        items={items}
        label={label}
        name={name}
        noMatchesFound={noMatchesFound}
        onFilterChange={this.handleFilterChange}
        onNewItemCreated={this.handleNewItemCreate}
        onOpenChange={this.handleOpenChange}
        onRemoved={this.selectedChange}
        onSelected={this.selectedChange}
        placeholder={placeholder}
        position={position}
        selectedItems={selectedItems}
        shouldAllowCreateItem={shouldAllowCreateItem}
        shouldFitContainer={shouldFitContainer}
        shouldFocus={shouldFocus}
        shouldFlip={shouldFlip}
        icon={icon}
      />
    );
  }
}
