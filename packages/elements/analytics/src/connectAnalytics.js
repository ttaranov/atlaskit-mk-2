// @flow
import React, { Component, type ComponentType } from 'react';
import PropTypes from 'prop-types';

type CollectedEvents = {
  [eventName: string]: Object,
};

/*
The connectAnalytics HOC wraps a component and provides the `addAnalyticsPayload` method to it's
props. The method adds an analytics payload to a dispatch prop callback for an event that has been
captured by the component as per event names specified in `eventsToConnect`.
*/
const connectAnalytics = (
  WrappedComponent: ComponentType<*>,
  eventsToConnect: string[],
) =>
  class extends Component<{}, {}> {
    // $FlowFixMe - type ComponentType does have property displayName. Unsure why this fails.
    static displayName = `connectAnalytics(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    static contextTypes = {
      onAnalyticsEvent: PropTypes.func,
      getParentAnalyticsData: PropTypes.func,
    };

    static childContextTypes = {
      onAnalyticsEvent: PropTypes.func,
    };

    getChildContext() {
      return {
        onAnalyticsEvent: this.onAnalyticsEvent,
      };
    }

    // Does not support private events at this stage
    collectedEvents: CollectedEvents = {};

    setAnalyticsPayload = (eventName: string, eventData: Object) => {
      const { getParentAnalyticsData } = this.context;
      if (this.collectedEvents[eventName] != null) {
        console.error('Event payload already exists, possible race condition.');
      }
      const fullEventData =
        typeof getParentAnalyticsData === 'function'
          ? this.context.getParentAnalyticsData(eventName, false, eventData)
          : eventData;
      this.collectedEvents[eventName] = fullEventData;
    };

    getAnalyticsPayload = (eventName: string): {} => {
      const payload = this.collectedEvents[eventName];
      if (payload == null) {
        console.error(
          'Event payload does not exist. Make sure event is fired before associated callback',
        );
      }

      delete this.collectedEvents[eventName];

      return payload;
    };

    onAnalyticsEvent = (name: string, data: Object, isPrivate: boolean) => {
      if (eventsToConnect.find(eventName => eventName === name) != null) {
        this.setAnalyticsPayload(name, data);
      }

      // Pass the event up the hierarchy
      const { onAnalyticsEvent } = this.context;
      if (typeof onAnalyticsEvent === 'function') {
        onAnalyticsEvent(name, data, isPrivate);
      }
    };

    addAnalyticsPayload = (callback: Function, eventName: string) => (
      ...callbackParams: any
    ) => {
      const analyticsPayload = this.getAnalyticsPayload(eventName);
      callback(...callbackParams, analyticsPayload);
    };

    render() {
      return (
        <WrappedComponent
          getAnalyticsPayload={this.getAnalyticsPayload}
          {...this.props}
        />
      );
    }
  };

export default connectAnalytics;
