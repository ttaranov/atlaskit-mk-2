import * as React from 'react';

/*
  UIAnalyticsEvent.js
 */
export declare class UIAnalyticsEvent extends AnalyticsEvent
  implements UIAnalyticsEventInterface {
  constructor(props: UIAnalyticsEventProps);
  context: Array<ObjectType>;
  handlers: Array<UIAnalyticsEventHandlerSignature>;
  hasFired: boolean;

  clone: () => UIAnalyticsEvent | null;
  fire(channel?: ChannelIdentifier): void;
  update(updater: AnalyticsEventUpdater): AnalyticsEvent;
}

/*
  types.js
 */

// Utils
export type ObjectType = { [key: string]: any };

// Basic events
export declare type AnalyticsEventPayload = {
  action: string;
  [key: string]: any;
};

export declare type AnalyticsEventUpdater =
  | ObjectType
  | ((payload: AnalyticsEventPayload) => AnalyticsEventPayload);

export type AnalyticsEventProps = {
  action: string;
  payload: AnalyticsEventPayload;
};

export declare interface AnalyticsEventInterface {
  payload: AnalyticsEventPayload;

  clone: () => AnalyticsEvent;
  update(updater: AnalyticsEventUpdater): AnalyticsEvent;
}

export declare type ChannelIdentifier = string;

export declare interface UIAnalyticsEventHandlerSignature {
  (event: UIAnalyticsEvent, channel?: ChannelIdentifier): void;
}

export type UIAnalyticsEventProps = AnalyticsEventProps & {
  context?: Array<ObjectType>;
  handlers?: Array<UIAnalyticsEventHandlerSignature>;
};

export declare interface UIAnalyticsEventInterface {
  context: Array<ObjectType>;
  handlers?: Array<UIAnalyticsEventHandlerSignature>;
  hasFired: boolean;
  payload: AnalyticsEventPayload;

  clone: () => UIAnalyticsEvent | null;
  fire(channel?: ChannelIdentifier): void;
  update(updater: AnalyticsEventUpdater): AnalyticsEvent;
}

/*
  AnalyticsEvent.js
*/
export declare class AnalyticsEvent implements AnalyticsEventInterface {
  constructor(props: AnalyticsEventProps);
  payload: AnalyticsEventPayload;

  clone: () => AnalyticsEvent | null;
  update(updater: AnalyticsEventUpdater): AnalyticsEvent;
}

/*
  AnalyticsListener.js
 */
export declare interface AnalyticsListenerProps {
  children?: React.ReactNode;
  channel?: string;
  onEvent: (event: UIAnalyticsEvent, channel?: string) => void;
}
export declare class AnalyticsListener extends React.Component<
  AnalyticsListenerProps
> {}

/*
  AnalyticsContext.js
 */
export declare interface AnalyticsContextProps {
  children: React.ReactNode;
  data: ObjectType;
}
export declare class AnalyticsContext extends React.Component<
  AnalyticsContextProps,
  any
> {}

/*
  withAnalyticsContext.js
 */
export type WithAnalyticsContextProps = {
  analyticsContext?: ObjectType;
};
export declare interface WithAnalyticsContextFunction {
  <TOwnProps>(component: React.ComponentClass<TOwnProps>): React.ComponentClass<
    TOwnProps & WithAnalyticsContextProps
  >;
}
export declare function withAnalyticsContext(
  defaultData?: any,
): WithAnalyticsContextFunction;

/*
  withAnalyticsEvents.js
 */
export declare interface CreateUIAnalyticsEventSignature {
  (payload?: AnalyticsEventPayload): UIAnalyticsEvent;
}

export declare interface EventMap<TOwnProps> {
  [k: string]:
    | ObjectType
    | ((
        create: CreateUIAnalyticsEventSignature,
        props: TOwnProps,
      ) => UIAnalyticsEvent | void);
}
export declare interface WithCreateAnalyticsEventProps {
  createAnalyticsEvent: CreateUIAnalyticsEventSignature;
}

export declare interface WithCreateAnalyticsEventFunction<TOwnProps> {
  (
    component: React.ComponentClass<WithCreateAnalyticsEventProps & TOwnProps>,
  ): React.ComponentClass<TOwnProps>;
}
export declare function withCreateAnalyticsEvent<TOwnProps>(
  createEventMap: EventMap<TOwnProps>,
): WithCreateAnalyticsEventFunction<TOwnProps>;
