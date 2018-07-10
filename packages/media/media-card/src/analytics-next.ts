// For version "1.1.3"
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
export type ObjectType = { [key: string]: any };

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

export declare class AnalyticsListener extends React.Component<
  AnalyticsListenerProps
> {}

/*
  AnalyticsContext.js
 */
export interface AnalyticsContextProps {
  children: React.ReactNode;
  data: ObjectType;
}

export declare class AnalyticsContext extends React.Component<
  AnalyticsContextProps
> {}

/*
  withAnalyticsContext.js
 */
export type WithAnalyticsContextProps = {
  analyticsContext?: ObjectType;
};

export type WithAnalyticsContextFunction = <TOwnProps>(
  component: React.ComponentClass<TOwnProps>,
) => React.ComponentClass<TOwnProps & WithAnalyticsContextProps>;

export declare function withAnalyticsContext(
  defaultData?: any,
): WithAnalyticsContextFunction;

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

export interface WithAnalyticsEventProps {
  createAnalyticsEvent: CreateUIAnalyticsEventSignature;
}

export type WithAnalyticsEventFunction = <TOwnProps>(
  component: React.ComponentClass<WithAnalyticsEventProps & TOwnProps>,
) => React.ComponentClass<TOwnProps>;

export declare function withAnalyticsEvents<TOwnProps>(
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

export declare function createAndFireEvent(
  channel?: string,
): CreateAndFireEventFunction;
