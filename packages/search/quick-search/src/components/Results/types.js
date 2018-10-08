// @flow
import type { Node, Element, ComponentType } from 'react';

export type AnalyticsData = {
  [key: string]: string | number,
};

// The data that's passed to the Click and MouseEnter events
export type ResultData = {|
  resultId: string | number,
  type: string,
|};

type CommonResultProps = {
  /** Content to be shown after the main content. Shown to the right of content
   (or to the left in RTL mode). */
  elemAfter?: Node,
  /** Location to link out to on click. */
  href?: string,
  /** Target to open the link in. */
  target?: string,
  /** Reduces padding and font size. */
  isCompact: boolean,
  /** Set whether the item should be highlighted as selected. Selected items have
   a different background color. */
  isSelected: boolean,
  /** Triggered by mouseClick event. Called with { `resultId`,  `type` }. */
  onClick: (resultData: ResultData) => mixed,
  /** Unique ID of the result. This is passed as a parameter to certain callbacks */
  resultId: string | number,
  /** Type of the result. This is passed as a parameter to certain callbacks. */
  type: string,
};

export type Context = {
  /** Register itself as keyboard navigation target */
  registerResult: (result: any) => void,
  /** Unregister itself as keyboard navigation target */
  unregisterResult: (result: any) => void,
  /** Triggered by mouseEnter event. Called with { `resultId`,  `type` }. */
  onMouseEnter: (resultData: ResultData) => void,
  /** Standard onMouseLeave event. */
  onMouseLeave: () => void,
  /** Fires an analytics event */
  sendAnalytics: (string, AnalyticsData) => mixed,
  /** get the index of the search result in the list of */
  getIndex: (string | number) => number | null,
  /** React component to be used for rendering links */
  linkComponent?: ComponentType<*>,
};

export type ResultType = CommonResultProps & {
  /** Text to appear to the right of the text. It has a lower font-weight. */
  caption?: string,
  /** React element to appear to the left of the text. */
  icon?: Node,
  /** Text to be shown alongside the main `text`. */
  subText?: string,
  /** Main text to be displayed as the item. */
  text: Element<any> | string,
  /** The context provided by QuickSearch. */
  context?: Context,
  /** key/value pairs of attributes to be send in analytics events. */
  analyticsData?: AnalyticsData,
};

export type ContainerResultType = CommonResultProps & {
  /** Src URL of the image to be used as the result's icon, overriden by avatar prop */
  avatarUrl?: string,
  /** React Component of the image to be used as the result's icon, takes precedence over avatarUrl */
  avatar?: Node,
  /** Text to appear to the right of the text. It has a lower font-weight. */
  caption?: string,
  /** Set whether to display a lock on the result's icon */
  isPrivate?: boolean,
  /** Name of the container. Provides the main text to be displayed as the item. */
  name: Element<any> | string,
  /** Text to be shown alongside the main `text`. */
  subText?: string,
};

export type ObjectResultType = CommonResultProps & {
  /** Src URL of the image to be used as the result's icon */
  avatarUrl?: string,
  /** React Component of the image to be used as the result's icon, takes precedence over avatarUrl */
  avatar?: Node,
  /** Text to appear to the right of the text. It has a lower font-weight. */
  caption?: string,
  /** Name of the container to which the object belongs. Displayed alongside the name */
  containerName?: string,
  /** Set whether to display a lock on the result's icon */
  isPrivate?: boolean,
  /** Name of the object. Provides the main text to be displayed as the item.. */
  name: Element<any> | string,
  /** A key or identifier of the object. Ajoined to the `containerName` when provided. */
  objectKey?: string,
};

export type PersonResultType = CommonResultProps & {
  /** Src URL of the image to be used as the result's icon */
  avatarUrl?: string,
  /** React Component of the image to be used as the result's icon, takes precedence over avatarUrl */
  avatar?: Node,
  /** React element to appear to the left of the text. */
  icon?: Node,
  /** A user's custom handle. Appears to the right of their `name`. It has a lower
   font-weight. */
  mentionName?: string,
  /** A character with which to prefix the `mentionName`. Defaults to '@' */
  mentionPrefix: string,
  /** Name of the object. Provides the main text to be displayed as the item.. */
  name: Element<any> | string,
  /** Text to be shown alongside the main `text`. */
  presenceMessage?: string,
  /** Sets the appearance of the presence indicator */
  presenceState: 'online' | 'busy' | 'offline' | null,
};
