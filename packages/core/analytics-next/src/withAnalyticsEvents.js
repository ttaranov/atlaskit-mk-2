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

      // Store references to the original and patched event props so we can determine when to update
      // the patched props
      originalEventProps: {} = {};
      patchedEventProps: {} = {};

      constructor(props) {
        super(props);
        Object.keys(createEventMap).forEach(p => {
          this.originalEventProps[p] = props[p];
        });
        this.patchedEventProps = this.mapCreateEventsToProps(
          Object.keys(createEventMap),
          props,
        );
      }

      // Update patched event props only if the original props have changed
      updatePatchedEventProps = props => {
        const changedPropCallbacks = Object.keys(createEventMap).filter(
          p => this.originalEventProps[p] !== props[p],
        );
        if (changedPropCallbacks.length > 0) {
          this.patchedEventProps = {
            ...this.patchedEventProps,
            ...this.mapCreateEventsToProps(changedPropCallbacks, props),
          };
          changedPropCallbacks.forEach(p => {
            this.originalEventProps[p] = props[p];
          });
        }

        return this.patchedEventProps;
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

      mapCreateEventsToProps = (changedPropNames: string[], props) =>
        changedPropNames.reduce((modified, propCallbackName) => {
          const eventCreator = createEventMap[propCallbackName];
          const providedCallback = props[propCallbackName];
          if (!['object', 'function'].includes(typeof eventCreator)) {
            return modified;
          }
          const modifiedCallback = (...args) => {
            const analyticsEvent =
              typeof eventCreator === 'function'
                ? eventCreator(this.createAnalyticsEvent, props)
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
        const patchedEventProps = this.updatePatchedEventProps(this.props);
        const props = { ...this.props, ...patchedEventProps };
        return (
          <WrappedComponent
            {...props}
            createAnalyticsEvent={this.createAnalyticsEvent}
          />
        );
      }
    };
}
