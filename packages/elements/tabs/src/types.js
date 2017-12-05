// @flow
import type { Node } from 'react';

export type FunctionType = (...args: Array<any>) => mixed;
export type StatefulTab = {
  content?: Node,
  defaultSelected?: boolean,
  label: string,
  isSelected?: boolean,
};
export type StatelessTab = {
  content?: Node,
  isSelected?: boolean,
  label: string,
  onSelect: FunctionType,
};

export type StatefulTabs = Array<StatefulTab>;

export type StatelessTabs = Array<StatelessTab>;

export type TabsStatelessProps = {
  /** Handler for navigation using the keyboard buttons. */
  onKeyboardNav: string => void,
  /** The tabs to display, with content being hidden unless the tab is selected. */
  tabs?: StatelessTabs,
};
