// @flow

import type { ComponentType, Element } from 'react';

type ComponentsType = { [key: string]: ComponentType<*> };

export type SwitcherProps = {
  /* Close the menu when the user clicks create */
  closeMenuOnCreate?: boolean,
  /* Replaceable components */
  components?: ComponentsType,
  /* The action and text representing a create button as the footer */
  create?: { onClick: (*) => void, text: string },
  /* The react element to display as the footer, beneath the list */
  footer?: Element<*>,
  /* The options presented in the select menu */
  options: Array<Object>,
  /* The target element, which invokes the select menu */
  target: Element<*>,
};

export type SwitcherState = {
  isOpen: boolean,
  mergedComponents: ComponentsType,
};
