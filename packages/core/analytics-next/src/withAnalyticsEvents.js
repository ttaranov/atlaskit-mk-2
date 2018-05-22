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

type State = {
  patchedProps: any,
};

export default function withAnalyticsEvents<
  Props: {},
  InnerComponent: ComponentType<Props>,
  ExternalProps: $Diff<ElementConfig<InnerComponent>, AnalyticsEventsProps>,
>(
  createEventMap: EventMap<ExternalProps> = {},
): (WrappedComponent: InnerComponent) => ComponentType<ExternalProps> {
  return WrappedComponent =>
    class WithAnalyticsEvents extends Component<ExternalProps, State> {
      static displayName = `WithAnalyticsEvents(${WrappedComponent.displayName ||
        WrappedComponent.name})`;

      static contextTypes = {
        getAtlaskitAnalyticsEventHandlers: PropTypes.func,
        getAtlaskitAnalyticsContext: PropTypes.func,
      };

      constructor(props) {
        super(props);
        this.state = {
          patchedProps: this.mapCreateEventsToProps(
            Object.keys(createEventMap),
            props,
          ),
        };
      }

      componentWillReceiveProps(nextProps) {
        const changedPropCallbacks = Object.keys(createEventMap).filter(
          p => this.props[p] !== nextProps[p],
        );
        if (changedPropCallbacks.length > 0) {
          this.setState({
            patchedProps: {
              ...this.state.patchedProps,
              ...this.mapCreateEventsToProps(changedPropCallbacks, nextProps),
            },
          });
        }
      }

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
        const props = { ...this.props, ...this.state.patchedProps };
        return (
          <WrappedComponent
            {...props}
            createAnalyticsEvent={this.createAnalyticsEvent}
          />
        );
      }
    };
}
