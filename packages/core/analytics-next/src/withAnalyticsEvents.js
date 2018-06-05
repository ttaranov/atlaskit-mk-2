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

const creator = <T: {}>(
  descriptor: AnalyticsEventPayload | AnalyticsEventCreator<T>,
): AnalyticsEventCreator<T> =>
  typeof descriptor === 'object'
    ? // $FlowFixMe unfortunately flow can't narrow between and object and function
      (create, props) => create(descriptor)
    : descriptor;

const toObject = <K: string, V>(
  obj: { [K]: V },
  { key, value }: { key: K, value: V },
) => ({
  ...obj,
  [key]: value,
});

// given all props and a map with the callback props to add analytics,
// patch the callbacks to provide analytics information.
const modifyCallbackProps = <T: {}>(
  props: T,
  eventMap: $Shape<T>,
  createAnalyticsEvent: CreateUIAnalyticsEvent,
): $Shape<T> =>
  Object.keys(eventMap)
    .map(key => ({ key, value: creator(eventMap[key]) }))
    .map(({ key, value }) => ({
      key,
      value: (...args) => {
        const providedCallback = props[key];
        const event = value(createAnalyticsEvent, props);
        if (providedCallback) {
          providedCallback(...args, event);
        }
      },
    }))
    .reduce(toObject, {});

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
              const modifiedProps = modifyCallbackProps(
                props,
                createEventMap,
                createAnalyticsEvent,
              );
              const prevProps = propsCache(props);
              const prevModifiedProps = modifiedPropsCache(modifiedProps);
              const cachedProps = Object.keys(modifiedProps)
                .map(key => ({
                  key,
                  value:
                    prevProps[key] === props[key]
                      ? prevModifiedProps[key]
                      : modifiedProps[key],
                }))
                .reduce(toObject, {});
              return (
                <WrappedComponent
                  {...props}
                  {...cachedProps}
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
