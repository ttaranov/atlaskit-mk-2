// @flow
import type { Element, Node } from 'react';
import type { PropType } from 'babel-plugin-react-flow-props-to-prop-types'; // eslint-disable-line import/no-extraneous-dependencies

export type ChildrenType = PropType<Array<Element<any>> | Element<any>, any>;
export type FunctionType = (...args: Array<any>) => mixed;
export type StatefulTab = {
  content?: any,
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
