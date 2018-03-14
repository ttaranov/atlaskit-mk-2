// @flow
import React, { PureComponent, type Node } from 'react';
import StatelessSelect, { getTextContent } from './StatelessSelect';
import type { ItemType, GroupType } from '../types';

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
  appearance?: 'default' | 'subtle',
  /** Item to be selected on component mount. */
  defaultSelected?: ItemType,
  /** Sets whether the dropdown should be constrained to the width of its trigger */
  droplistShouldFitContainer?: boolean,
  /** Sets whether the field should be selectable. If it is, the field will be
   a text box, which will filter the items. */
  hasAutocomplete?: boolean,
  /** id property to be passed down to the html select component. */
  id?: string,
  /** message to show on the dialog when isInvalid is true */
  invalidMessage?: Node,
  /** controls the top margin of the label component rendered. */
  isFirstChild?: boolean,
  /** Sets whether the select is selectable. Changes hover state. */
  isDisabled?: boolean,
  /** Sets whether the component should be open on mount. */
  isDefaultOpen?: boolean,
  /** Sets whether form including select can be submitted without an option
   being made. */
  isRequired?: boolean,
  /** Set whether there is an error with the selection. Sets an orange border
   and shows the warning icon. */
  isInvalid?: boolean,
  /** An array of objects, each one of which must have an array of items, and
  may have a heading. All items should have content and value properties, with
  content being the displayed text. */
  items?: Array<GroupType>,
  /** Label to be displayed above select. */
  label?: string,
  /** name property to be passed to the html select element. */
  name?: string,
  /** Message to display in any group in items if there are no items in it,
   including if there is one item that has been selected. */
  noMatchesFound?: string,
  /** Handler to be called when the filtered items changes. */
  onFilterChange?: Function,
  /** Handler to be called when an item is selected. Called with an object that
   has the item selected as a property on the object. */
  onSelected?: Function,
  /** Handler called when the select is opened or closed. Called with an object
   that has both the event, and the new isOpen state. */
  onOpenChange?: ({ event: SyntheticEvent<any>, isOpen: boolean }) => void,
  /** Text to be shown within the select when no item is selected. */
  placeholder?: string,
  /** Where the select dropdown should be displayed relative to the field position. */
  position?: string,
  /** Sets whether the field should be constrained to the width of its trigger */
  shouldFitContainer?: boolean,
  /** Sets whether the field will become focused. */
  shouldFocus?: boolean,
  /** Sets whether the droplist should flip its position when there is not enough space. */
  shouldFlip?: boolean,
  /** Set the max height of the dropdown list in pixels. */
  maxHeight?: number,
};

type State = {
  isOpen?: boolean,
  selectedItem?: ItemType,
  filterValue: string,
};

export default class AkSingleSelect extends PureComponent<Props, State> {
  static defaultProps = {
    appearance: appearances.default,
    droplistShouldFitContainer: true,
    isRequired: false,
    items: [],
    label: '',
    onFilterChange: () => {},
    onOpenChange: () => {},
    onSelected: () => {},
    placeholder: '',
    position: 'bottom left',
    shouldFocus: false,
    shouldFlip: true,
  };

  state = {
    isOpen: this.props.isDefaultOpen,
    selectedItem: this.props.defaultSelected,
    filterValue: this.props.defaultSelected
      ? getTextContent(this.props.defaultSelected)
      : '',
  };

  selectItem = (item: ItemType) => {
    this.setState({ isOpen: false, selectedItem: item });
    if (this.props.onSelected) {
      this.props.onSelected({ item });
    }
  };

  handleOpenChange = (attrs: {
    event: SyntheticEvent<any>,
    isOpen: boolean,
  }) => {
    // allows consuming components to look for `defaultPrevented` on the event
    // where they can handle internal state e.g. prevent InlineDialog from closing when
    // the target DOM node no-longer exists
    if (!attrs.isOpen) attrs.event.preventDefault();

    this.setState({ isOpen: attrs.isOpen });
    if (this.props.onOpenChange) {
      this.props.onOpenChange(attrs);
    }
  };

  handleFilterChange = (value: string) => {
    if (this.props.onFilterChange) {
      this.props.onFilterChange(value);
    }
    this.setState({ filterValue: value });
  };

  render() {
    return (
      <StatelessSelect
        appearance={this.props.appearance}
        droplistShouldFitContainer={this.props.droplistShouldFitContainer}
        filterValue={this.state.filterValue}
        hasAutocomplete={this.props.hasAutocomplete}
        id={this.props.id}
        isDisabled={this.props.isDisabled}
        isFirstChild={this.props.isFirstChild}
        isInvalid={this.props.isInvalid}
        invalidMessage={this.props.invalidMessage}
        isOpen={this.state.isOpen}
        isRequired={this.props.isRequired}
        items={this.props.items}
        label={this.props.label}
        name={this.props.name}
        noMatchesFound={this.props.noMatchesFound}
        onFilterChange={this.handleFilterChange}
        onOpenChange={this.handleOpenChange}
        onSelected={this.selectItem}
        placeholder={this.props.placeholder}
        position={this.props.position}
        selectedItem={this.state.selectedItem}
        shouldFitContainer={this.props.shouldFitContainer}
        shouldFocus={this.props.shouldFocus}
        shouldFlip={this.props.shouldFlip}
        maxHeight={this.props.maxHeight}
      />
    );
  }
}
