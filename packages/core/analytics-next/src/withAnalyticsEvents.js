// @flow

import React, {
  Component,
  type Node,
  type ComponentType,
  type ElementConfig,
} from 'react';
import PropTypes from 'prop-types';

import UIAnalyticsEvent from './UIAnalyticsEvent';
import type { AnalyticsEventPayload } from './types';

export type CreateUIAnalyticsEvent = (
  payload: AnalyticsEventPayload,
) => UIAnalyticsEvent;

export type WithAnalyticsEventsProps = {
  createAnalyticsEvent: CreateUIAnalyticsEvent,
};

type AnalyticsEventsProps = {
  createAnalyticsEvent: CreateUIAnalyticsEvent | void,
};

type AnalyticsEventCreator<ProvidedProps: {}> = (
  create: CreateUIAnalyticsEvent,
  props: ProvidedProps,
) => UIAnalyticsEvent;

type EventMap<ProvidedProps: {}> = {
  [string]: AnalyticsEventPayload | AnalyticsEventCreator<ProvidedProps>,
};

// This component is used to grab the analytics functions off context.
// It uses legacy context, but provides an API similar to 16.3 context.
// This makes it easier to use with the forward ref API.
class AnalyticsContextConsumer extends Component<{
  children: CreateUIAnalyticsEvent => Node,
}> {
  static contextTypes = {
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
    getAtlaskitAnalyticsContext: PropTypes.func,
  };
  createAnalyticsEvent = (payload: AnalyticsEventPayload): UIAnalyticsEvent => {
    const {
      getAtlaskitAnalyticsEventHandlers,
      getAtlaskitAnalyticsContext,
    } = this.context;
    const context =
      (typeof getAtlaskitAnalyticsContext === 'function' &&
        getAtlaskitAnalyticsContext()) ||
      [];
    const handlers =
      (typeof getAtlaskitAnalyticsEventHandlers === 'function' &&
        getAtlaskitAnalyticsEventHandlers()) ||
      [];
    return new UIAnalyticsEvent({ context, handlers, payload });
  };
  render() {
    return this.props.children(this.createAnalyticsEvent);
  }
}

type Obj<T> = { [string]: T };
// helper that provides an easy way to map an object's values
// ({ string: A }, (string, A) => B) => { string: B }
const vmap = <A, B>(obj: Obj<A>, fn: (string, A) => B): Obj<B> =>
  Object.keys(obj).reduce((curr, k) => ({ ...curr, [k]: fn(k, obj[k]) }), {});

// given all props and a map with the callback props to add analytics,
// patch the callbacks to provide analytics information.
const modifyCallbackProp = <T: {}>(
  propName: string,
  eventMapEntry: AnalyticsEventPayload | AnalyticsEventCreator<T>,
  props: T,
  createAnalyticsEvent: CreateUIAnalyticsEvent,
) => (...args) => {
  const event =
    typeof eventMapEntry === 'function'
      ? eventMapEntry(createAnalyticsEvent, props)
      : createAnalyticsEvent(eventMapEntry);
  const providedCallback = props[propName];
  if (providedCallback) {
    providedCallback(...args, event);
  }
};

const createCache = () => {
  let value = {};
  return next => {
    const ret = value;
    value = next;
    return ret;
  };
};

export default function withAnalyticsEvents<
  Props: {},
  InnerComponent: ComponentType<Props>,
  ExternalProps: $Diff<ElementConfig<InnerComponent>, AnalyticsEventsProps>,
>(
  createEventMap: EventMap<ExternalProps> = {},
): (WrappedComponent: InnerComponent) => ComponentType<ExternalProps> {
  return WrappedComponent => {
    const propsCache = createCache();
    const modifiedPropsCache = createCache();
    // $FlowFixMe - flow 0.67 doesn't know about forwardRef
    const WithAnalyticsEvents = React.forwardRef(
      (props: ExternalProps, ref) => {
        return (
          <AnalyticsContextConsumer>
            {createAnalyticsEvent => {
              const prevProps = propsCache(props);
              const prevModifiedProps = modifiedPropsCache({});
              const modifiedProps = vmap(
                createEventMap,
                (propName, entry) =>
                  prevProps[propName] === props[propName]
                    ? prevModifiedProps[propName]
                    : modifyCallbackProp(
                        propName,
                        entry,
                        props,
                        createAnalyticsEvent,
                      ),
              );
              modifiedPropsCache(modifiedProps);
              return (
                <WrappedComponent
                  {...props}
                  {...modifiedProps}
                  createAnalyticsEvent={createAnalyticsEvent}
                  ref={ref}
                />
              );
            }}
          </AnalyticsContextConsumer>
        );
      },
    );

    WithAnalyticsEvents.displayName = `WithAnalyticsEvents(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    return WithAnalyticsEvents;
  };
}
