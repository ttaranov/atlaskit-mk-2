// @flow

import React, {
  Component,
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

type EventMap<ProvidedProps> = {
  [string]:
    | AnalyticsEventPayload
    | ((
        create: CreateUIAnalyticsEvent,
        props: ProvidedProps,
      ) => UIAnalyticsEvent | void),
};

export default function withAnalyticsEvents<
  Props: {},
  InnerComponent: ComponentType<Props>,
  ExternalProps: $Diff<ElementConfig<InnerComponent>, AnalyticsEventsProps>,
>(
  createEventMap: EventMap<ExternalProps> = {},
): (WrappedComponent: InnerComponent) => ComponentType<ExternalProps> {
  return WrappedComponent =>
    class WithAnalyticsEvents extends Component<ExternalProps> {
      static displayName = `WithAnalyticsEvents(${WrappedComponent.displayName ||
        WrappedComponent.name})`;

      static contextTypes = {
        getAtlaskitAnalyticsEventHandlers: PropTypes.func,
        getAtlaskitAnalyticsContext: PropTypes.func,
      };

      createAnalyticsEvent = (
        payload: AnalyticsEventPayload,
      ): UIAnalyticsEvent => {
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

      mapCreateEventsToProps = () =>
        Object.keys(createEventMap).reduce((modified, propCallbackName) => {
          const eventCreator = createEventMap[propCallbackName];
          const providedCallback = this.props[propCallbackName];
          if (!['object', 'function'].includes(typeof eventCreator)) {
            return modified;
          }
          const modifiedCallback = (...args) => {
            const analyticsEvent =
              typeof eventCreator === 'function'
                ? eventCreator(this.createAnalyticsEvent, this.props)
                : this.createAnalyticsEvent(eventCreator);

            if (providedCallback) {
              providedCallback(...args, analyticsEvent);
            }
          };
          return {
            ...modified,
            [propCallbackName]: modifiedCallback,
          };
        }, {});

      render() {
        const props = { ...this.props, ...this.mapCreateEventsToProps() };
        return (
          <WrappedComponent
            {...props}
            createAnalyticsEvent={this.createAnalyticsEvent}
          />
        );
      }
    };
}
