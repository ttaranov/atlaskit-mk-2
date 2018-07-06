// For version "2.1.9"
import * as React from 'react';

declare module '@atlaskit/analytics-next' {
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

  // That replaces {} in flow types
  type ObjectType = { [key: string]: any };

  // Basic events
  type AnalyticsEventPayload = {
    action: string;
    [key: string]: any;
  };

  type AnalyticsEventUpdater =
    | ObjectType
    | ((payload: AnalyticsEventPayload) => AnalyticsEventPayload);

  type AnalyticsEventProps = {
    payload: AnalyticsEventPayload;
  };

  interface AnalyticsEventInterface {
    payload: AnalyticsEventPayload;

    clone: () => AnalyticsEventInterface;

    update(updater: AnalyticsEventUpdater): AnalyticsEventInterface;
  }

  type ChannelIdentifier = string;

  // It's called UIAnalyticsEventHandler in flow
  interface UIAnalyticsEventHandlerSignature {
    (event: UIAnalyticsEventInterface, channel?: ChannelIdentifier): void;
  }

  type UIAnalyticsEventProps = AnalyticsEventProps & {
    context?: Array<ObjectType>;
    handlers?: Array<UIAnalyticsEventHandlerSignature>;
  };

  // Called UIAnalyticsEvent in flow
  interface UIAnalyticsEventInterface {
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
  interface AnalyticsListenerProps {
    children?: React.ReactNode;
    channel?: string;
    onEvent: (event: UIAnalyticsEventInterface, channel?: string) => void;
  }

  class AnalyticsListener extends React.Component<AnalyticsListenerProps> {}

  /*
    AnalyticsContext.js
   */
  interface AnalyticsContextProps {
    children: React.ReactNode;
    data: ObjectType;
  }

  class AnalyticsContext extends React.Component<AnalyticsContextProps> {}

  /*
    withAnalyticsContext.js
   */
  type WithAnalyticsContextProps = {
    analyticsContext?: ObjectType;
  };

  type WithAnalyticsContextFunction = <TOwnProps>(
    component: React.ComponentClass<TOwnProps>,
  ) => React.ComponentClass<TOwnProps & WithAnalyticsContextProps>;

  function withAnalyticsContext(
    defaultData?: any,
  ): WithAnalyticsContextFunction;

  /*
    withAnalyticsEvents.js
   */
  type CreateUIAnalyticsEventSignature = (
    payload: AnalyticsEventPayload,
  ) => UIAnalyticsEventInterface;

  interface EventMap<TOwnProps> {
    [k: string]:
      | AnalyticsEventPayload
      | ((
          create: CreateUIAnalyticsEventSignature,
          props: TOwnProps,
        ) => UIAnalyticsEventInterface | void);
  }

  interface WithAnalyticsEventProps {
    createAnalyticsEvent: CreateUIAnalyticsEventSignature | void;
  }

  type WithAnalyticsEventFunction = <TOwnProps>(
    component: React.ComponentClass<WithAnalyticsEventProps & TOwnProps>,
  ) => React.ComponentClass<TOwnProps>;

  function withAnalyticsEvents<TOwnProps>(
    createEventMap?: EventMap<TOwnProps>,
  ): WithAnalyticsEventFunction;

  /*
    createAndFireEvent.js
   */

  type CreateAndFireEventFunction = (
    payload: AnalyticsEventPayload,
  ) => (
    createAnalyticsEvent: CreateUIAnalyticsEventSignature,
  ) => UIAnalyticsEventInterface;

  function createAndFireEvent(channel?: string): CreateAndFireEventFunction;

  /*
    cleanProps.js
   */
  function cleanProps(props: ObjectType): ObjectType;
}
