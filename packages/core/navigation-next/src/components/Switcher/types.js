// @flow

import type { ComponentType, Element } from 'react';

export type SwitcherProps = {
  /* The action and text representing a create button as the footer */
  create?: { onClick: (*) => void, text: string },
  /* Close the menu when the user clicks create */
  closeMenuOnCreate: boolean,
  /* Replaceable components */
  components: { [key: string]: ComponentType<*> },
  /* The options presented in the select menu */
  options: Array<Object>,
  /* The target element, which invokes the select menu */
  target: Element<*>,
};

export type SwitcherState = {
  isOpen: boolean,
};
