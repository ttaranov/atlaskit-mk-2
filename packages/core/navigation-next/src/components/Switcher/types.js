// @flow

import type { ComponentType, Element } from 'react';

export type SwitcherProps = {
  /* The action and text representing a create button as the footer */
  create?: { onClick: (*) => void, text: string },
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
