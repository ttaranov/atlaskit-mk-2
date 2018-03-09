// For version "1.0.2"
import * as React from 'react';

// This is not needed for classes UIAnalyticsEvent and AnalyticsEvent,
// since they are classes (classes are used to create instances) and
// instances of UIAnalyticsEvent are meant to be created inside analytics-next library itself only.
// So we need only interfaces to describe an instances created with those Classes.

/*
  UIAnalyticsEvent.js
 */

// See remark on classes above

/*
  types.js
 */

// Utils
export declare type ObjectType = { [key: string]: any };

// Basic events
export type AnalyticsEventPayload = {
  action: string;
  [key: string]: any;
};

export type AnalyticsEventUpdater =
  | ObjectType
  | ((payload: AnalyticsEventPayload) => AnalyticsEventPayload);

export type AnalyticsEventProps = {
  action: string;
  payload: AnalyticsEventPayload;
};

export interface AnalyticsEventInterface {
  payload: AnalyticsEventPayload;

  clone: () => AnalyticsEventInterface;

  update(updater: AnalyticsEventUpdater): AnalyticsEventInterface;
}

export type ChannelIdentifier = string;

export interface UIAnalyticsEventHandlerSignature {
  (event: UIAnalyticsEventInterface, channel?: ChannelIdentifier): void;
}

export type UIAnalyticsEventProps = AnalyticsEventProps & {
  context?: Array<ObjectType>;
  handlers?: Array<UIAnalyticsEventHandlerSignature>;
};

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

// See remark on classes above

/*
  AnalyticsListener.js
 */
export interface AnalyticsListenerProps {
  children?: React.ReactNode;
  channel?: string;
  onEvent: (event: UIAnalyticsEventInterface, channel?: string) => void;
}

export type AnalyticsListener = React.ComponentClass<AnalyticsListenerProps>;

/*
  AnalyticsContext.js
 */
export interface AnalyticsContextProps {
  children: React.ReactNode;
  data: ObjectType;
}

export type AnalyticsContext = React.ComponentClass<AnalyticsContextProps>;

/*
  withAnalyticsContext.js
 */
export type WithAnalyticsContextProps = {
  analyticsContext?: ObjectType;
};

export type WithAnalyticsContextFunction = <TOwnProps>(
  component: React.ComponentClass<TOwnProps>,
) => React.ComponentClass<TOwnProps & WithAnalyticsContextProps>;

// Signature for withAnalyticsContext function
export type WithAnalyticsContextSignature = (
  defaultData?: any,
) => WithAnalyticsContextFunction;

/*
  withAnalyticsEvents.js
 */
export type CreateUIAnalyticsEventSignature = (
  payload?: AnalyticsEventPayload,
) => UIAnalyticsEventInterface;

export interface EventMap<TOwnProps> {
  [k: string]:
    | ObjectType
    | ((
        create: CreateUIAnalyticsEventSignature,
        props: TOwnProps,
      ) => UIAnalyticsEventInterface | void);
}

export interface WithCreateAnalyticsEventProps {
  createAnalyticsEvent: CreateUIAnalyticsEventSignature;
}

export type WithCreateAnalyticsEventFunction = <TOwnProps>(
  component: React.ComponentClass<WithCreateAnalyticsEventProps & TOwnProps>,
) => React.ComponentClass<TOwnProps>;

// Signature for withAnalyticsEvents function
export type WithAnalyticsEventsSignature = <TOwnProps>(
  createEventMap?: EventMap<TOwnProps>,
) => WithCreateAnalyticsEventFunction;
