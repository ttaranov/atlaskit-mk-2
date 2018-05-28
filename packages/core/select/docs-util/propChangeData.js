// @flow
export const singleSelectPropChanges = [
  ['appearance', 'removed'],
  ['defaultSelected', 'renamed', 'defaultValue'],
  ['droplistShouldFitContainer', 'removed'],
  ['hasAutocomplete', 'renamed', 'isSearchable'],
  ['id', 'renamed', 'instanceId'],
  ['invalidMessage', 'removed'],
  ['isFirstChild', 'removed'],
  ['isDisabled', 'unchanged'],
  ['isRequired', 'removed'],
  ['isOpen', 'renamed', 'menuIsOpen'],
  ['isInvalid', 'removed'],
  ['items', 'renamed', 'options'],
  ['label', 'removed'],
  ['loadingMessage', 'changed', '({inputValue: string}) => string'],
  ['name', 'removed'],
  [
    'noMatchesFound',
    'renamed',
    'noOptionsMessage, now has the following shape: \n ({ inputValue: string }) => string',
  ],
  [
    'onFilterChange',
    'renamed',
    'onInputChange, has the following shape: \n (ValueType, ActionMeta) => void',
  ],
  ['onSelected', 'renamed', 'onChange'],
  ['onOpenChange', 'changed', 'use onMenuOpen and onMenuClose respectively'],
  ['placeholder', 'unchanged'],
  ['selectedItem', 'renamed', 'value'],
  ['shouldFitContainer', 'removed'],
  ['shouldFlip', 'removed'],
  ['maxHeight', 'removed'],
];

export const multiSelectPropsChanges = [
  ...singleSelectPropChanges,
  ['footer', 'removed'],
  ['onNewItemCreated', 'removed'],
  ['shouldAllowCreateItem', 'removed'],
  ['onRemoved', 'removed'],
];
