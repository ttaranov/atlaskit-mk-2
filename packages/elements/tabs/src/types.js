// @flow
import type { ComponentType } from 'react';

export type TabData = { [string]: any };

export type TabItemComponentProvided = {
  /** HTML attribute. Simply pass this to your custom element. */
  'aria-posinset': number,
  /** HTML attribute. Simply pass this to your custom element. */
  'aria-selected': boolean,
  /** HTML attribute. Simply pass this to your custom element. */
  'aria-setsize': number,
  /** The complete tab object which you provided to Tabs in the tabs array. */
  data: TabData,
  /** Interaction handler. Simply pass this to your custom element. */
  onClick: () => void,
  /** Interaction handler. Simply pass this to your custom element. */
  onKeyDown: (e: KeyboardEvent) => void,
  /** Interaction handler. Simply pass this to your custom element. */
  onMouseDown: (e: MouseEvent) => void,
  /** HTML attribute. Simply pass this to your custom element. */
  role: string,
  /** HTML attribute. Simply pass this to your custom element. */
  tabIndex: number,
  /** A ref callback which you'll need to attach to your underlying DOM node. */
  innerRef: (ref: HTMLElement) => void,
  /** Whether this tab is currently selected. */
  isSelected: boolean,
};

export type TabContentComponentProvided = {
  /** The complete tab object which you provided to Tabs in the tabs array. */
  data: TabData,
  /** HTML attribute. Simply pass this to your custom element. */
  role: string,
  // elementProps: {},
};

export type TabItemType = ComponentType<TabItemComponentProvided>;
export type TabContentType = ComponentType<TabContentComponentProvided>;

export type selectedProp = any;
export type IsSelectedTestFunction = (
  selected: selectedProp,
  tab: TabData,
  tabIndex: number,
) => boolean;
type OnSelectCallback = (selected: TabData, selectedIndex: number) => void;

export type TabsProps = {
  /** The tab that will be selected by default when the component mounts. If not
   * set the first tab will be displayed by default. */
  defaultSelected?: selectedProp,
  /** Override the in-built check to determine whether a tab is selected. This
   * function will be passed some information about the selected tab, the tab to
   * be compared, and the index of the tab to be compared, as parameters in that
   * order. It must return a boolean. */
  isSelectedTest?: IsSelectedTestFunction,
  /** A callback function which will be fired when a new tab is selected. It
   * will be passed the data and the index of the selected tab as parameters. */
  onSelect?: OnSelectCallback,
  /** The selected tab. By default this prop accepts either the tab object or
   * the the tab's index. If used in conjunction with the isSelectedTest prop it
   * can be any arbitrary data. If this prop is set the component behaves as a
   * 'controlled' component, and will not maintain any internal state. It will
   * be up to you to listen to onSelect changes, update your own state, and pass
   * that information down to this prop accordingly. */
  selected?: selectedProp,
  /** A custom component to render instead of the default tab content pane. See
   * tabContentComponent Provided Props below for more information.
   */
  tabContentComponent: TabContentType,
  /** A custom component to render instead of the default tab item. See
   * tabItemComponent Provided Props below for more information.
   */
  tabItemComponent: TabItemType,
  /** An array of objects containing data for your tabs. By default a tab object
   * must include 'label' and 'content' properties, but if used in conjunction
   * with the tabItemComponent and tabContentComponent props this object can
   * have any shape you choose. */
  tabs: Array<TabData>,
};

export type TabsState = {
  selected: TabData,
};

export type TabsNavigationProps = {
  onSelect: OnSelectCallback,
  selected: TabData,
  tabItemComponent: TabItemType,
  tabs: Array<TabData>,
};
