// For version "3.0.0"
import * as React from 'react';

/*
  UIAnalyticsEvent.js
 */
export class UIAnalyticsEvent implements UIAnalyticsEventInterface {
  constructor(payload: UIAnalyticsEventProps);

  context: Array<ObjectType>;
  handlers?: Array<UIAnalyticsEventHandlerSignature>;
  hasFired: boolean;
  payload: AnalyticsEventPayload;

  clone: () => UIAnalyticsEventInterface | null;

  fire(channel?: ChannelIdentifier): void;

  update(updater: AnalyticsEventUpdater): UIAnalyticsEventInterface;
}

// See remark on classes above

/*
  types.js
 */

// Utils

// That replaces {} in flow types
export type ObjectType = { [key: string]: any };

// Basic events
export type AnalyticsEventPayload = {
  [key: string]: any;
};

export type AnalyticsEventUpdater =
  | ObjectType
  | ((payload: AnalyticsEventPayload) => AnalyticsEventPayload);

export type AnalyticsEventProps = {
  payload: AnalyticsEventPayload;
};

export interface AnalyticsEventInterface {
  payload: AnalyticsEventPayload;

  clone: () => AnalyticsEventInterface;

  update(updater: AnalyticsEventUpdater): AnalyticsEventInterface;
}

export type ChannelIdentifier = string;

// It's called UIAnalyticsEventHandler in flow
export interface UIAnalyticsEventHandlerSignature {
  (event: UIAnalyticsEventInterface, channel?: ChannelIdentifier): void;
}

export type UIAnalyticsEventProps = AnalyticsEventProps & {
  context?: Array<ObjectType>;
  handlers?: Array<UIAnalyticsEventHandlerSignature>;
};

// Called UIAnalyticsEvent in flow
export interface UIAnalyticsEventInterface {
  context: Array<ObjectType>;
  handlers?: Array<UIAnalyticsEventHandlerSignature>;
  hasFired: boolean;
  payload: AnalyticsEventPayload;

  clone: () => UIAnalyticsEventInterface | null;

  fire(channel?: ChannelIdentifier): void;

  update(updater: AnalyticsEventUpdater): UIAnalyticsEventInterface;
}

/*
  AnalyticsEvent.js
*/
declare class AnalyticsEvent implements AnalyticsEventInterface {
  payload: AnalyticsEventPayload;

  clone: () => AnalyticsEventInterface;

  update(updater: AnalyticsEventUpdater): AnalyticsEventInterface;
}

/*
  AnalyticsListener.js
 */
export interface AnalyticsListenerProps {
  children?: React.ReactNode;
  channel?: string;
  onEvent: (event: UIAnalyticsEventInterface, channel?: string) => void;
}

export class AnalyticsListener extends React.Component<
  AnalyticsListenerProps
> {}

/*
  AnalyticsContext.js
 */
export interface AnalyticsContextProps {
  children: React.ReactNode;
  data: ObjectType;
}

export class AnalyticsContext extends React.Component<AnalyticsContextProps> {}

/*
  withAnalyticsContext.js
 */
export type WithAnalyticsContextProps = {
  analyticsContext?: ObjectType;
};

export type WithAnalyticsContextFunction = <TOwnProps>(
  component: React.ComponentClass<TOwnProps>,
) => React.ComponentClass<TOwnProps & WithAnalyticsContextProps>;

export function withAnalyticsContext(
  defaultData?: any,
): WithAnalyticsContextFunction;

/*
  withAnalyticsEvents.js
 */
export type CreateUIAnalyticsEventSignature = (
  payload: AnalyticsEventPayload,
) => UIAnalyticsEventInterface;

interface AnalyticsEventCreator<TOwnProps> {
  (
    create: CreateUIAnalyticsEventSignature,
    props: TOwnProps,
  ): UIAnalyticsEventInterface;
}

export interface EventMap<TOwnProps> {
  [k: string]: AnalyticsEventPayload | AnalyticsEventCreator<TOwnProps>;
}

export interface WithAnalyticsEventProps {
  createAnalyticsEvent?: CreateUIAnalyticsEventSignature;
}

export type WithAnalyticsEventFunction = <TOwnProps>(
  component: React.ComponentClass<WithAnalyticsEventProps & TOwnProps>,
) => React.ComponentClass<TOwnProps>;

export function withAnalyticsEvents<TOwnProps>(
  createEventMap?: EventMap<TOwnProps>,
): WithAnalyticsEventFunction;

/*
  createAndFireEvent.js
 */

export type CreateAndFireEventFunction = (
  payload: AnalyticsEventPayload,
) => (
  createAnalyticsEvent: CreateUIAnalyticsEventSignature,
) => UIAnalyticsEventInterface;

export function createAndFireEvent(
  channel?: string,
): CreateAndFireEventFunction;

/*
  cleanProps.js
 */
export function cleanProps(props: ObjectType): ObjectType;
