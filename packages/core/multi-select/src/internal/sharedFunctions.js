// @flow
import type { ItemType, GroupType } from '../types';
/**
 * Try to match with filterValues first. If it's not provided, then match with content.
 */
const isMatched = (item, matchingValue) => {
  const filterValues = item.filterValues;
  if (filterValues && filterValues.length > 0) {
    return filterValues.some(
      value => value.toLowerCase().indexOf(matchingValue) > -1,
    );
  }

  return item.content.toLowerCase().indexOf(matchingValue) > -1;
};

const filterItems = (
  items: Array<ItemType>,
  filterValue: string,
  selectedItems?: Array<ItemType>,
) => {
  const value = filterValue;
  const trimmedValue = value && value.toLowerCase().trim();
  const selectedValues = selectedItems
    ? selectedItems.map(item => item.value)
    : [];
  const unselectedItems = items.filter(
    item => selectedValues.indexOf(item.value) === -1,
  );

  return trimmedValue
    ? unselectedItems.filter(item => isMatched(item, trimmedValue))
    : unselectedItems;
};

const getNextFocusable = (
  indexItem?: number | null,
  length: number,
  footerIsFocusable: boolean = false,
) => {
  let currentItem = indexItem;
  const footerShouldBeFocused = footerIsFocusable && currentItem === length - 1;

  if (currentItem == null) {
    currentItem = 0;
  } else if (currentItem < length - 1) {
    currentItem++;
  } else if (footerShouldBeFocused) {
    currentItem = length;
  } else {
    currentItem = 0;
  }

  return currentItem;
};

const getPrevFocusable = (
  indexItem?: number,
  length: number,
  footerIsFocusable: boolean = false,
) => {
  let currentItem = indexItem;
  const footerShouldBeFocused = footerIsFocusable && currentItem === 0;

  if (currentItem && currentItem > 0) {
    currentItem--;
  } else if (footerShouldBeFocused) {
    currentItem = length;
  } else {
    currentItem = length - 1;
  }

  return currentItem;
};

// This function exists because mutliselect supports two slightly different APIs when it comes to
// the `items` prop. One way is an array of Items
// i.e [{ content: 'one', value: 1}, { content: 'two', value: 2}, { content: 'three', value: 3}]
// the other is what can be thought of as an array of Groups
// i.e [{ heading: 'numbers', items: [...] }, { heading: 'letters', items: [...] }]
// In this form, the items array matches the one we see above.
// This function normalises `items` so that it will always be in the later form
const groupItems = (items: Array<any>): Array<GroupType> => {
  const firstItem = items[0] || {};
  return Array.isArray(firstItem.items) ? items : convertToGroupType(items);
};

const convertToGroupType = (items: Array<ItemType>): Array<GroupType> => [
  { items },
];

export { filterItems, getNextFocusable, getPrevFocusable, groupItems };
